const express = require('express');  
const {createServer} = require('http');
const {Server} = require('socket.io');
const exphbs = require('express-handlebars'); 
const mongoose = require('mongoose'); 
const path = require('path');   
const Product = require('./models/Product');  

const passport = require('passport');
const initializePassport = require('./config/passport/passport.config');

const jwt = require('jsonwebtoken');
const cookie = require('cookie');

const app = express(); 
const httpServer = createServer(app);
const io = new Server(httpServer); 

mongoose.connect("mongodb+srv://mari:coderhouse@cluster0.thp6hyf.mongodb.net/mongoFinal?retryWrites=true&w=majority&appName=Cluster0", {
}).then(() => console.log('MongoDB conectado'))
.catch(err => console.error(err)); 


app.use(express.json());    
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 

initializePassport();
app.use(passport.initialize());

app.engine('handlebars', exphbs.engine({
    helpers: {
        eq: function (a, b) {
            return a === b;
        },
        range: function (start, end) {
            let array = [];
            for (let i = start; i <= end; i++) {
                array.push(i);
            }
            return array;
        }
    },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));  

const viewsRouter = require('./routers/views.rutas'); 
const cartRouters = require('./routers/carts.rutas');   
const createProductsRouter = require('./routers/products.rutas');   
const sessionRouter = require('./routers/sessions.rutas');

const cookieParser = require('cookie-parser');
app.use(cookieParser());


app.use('/', viewsRouter);
app.use('/api/carts', cartRouters); 
app.use('/api/products', createProductsRouter(io));  

app.use('/api/sessions', sessionRouter);

io.on('connection', async socket => {
    try {
        const cookies = cookie.parse(socket.handshake.headers.cookie || '');
        const token = cookies.token; 

        if (!token) {
            console.log('Socket sin token. Desconectando...');
            return socket.disconnect(true);
        }

        const decoded = jwt.verify(token, 'secretoJWT'); 
        const user = decoded.user;

        if (!['admin', 'user'].includes(user.role)) {
            console.log('Socket con rol no autorizado. Desconectando...');
            return socket.disconnect(true);
        }

        console.log(`Socket conectado: ${user.email} (${user.role})`);

        const products = await Product.find();
        socket.emit('update-products', products);

        socket.on('new-product', async (productData) => {
            try {
                const nuevo = await Product.create(productData);
                const updatedProducts = await Product.find();
                io.emit('update-products', updatedProducts);
                socket.emit('product-added-success');
            } catch (err) {
                socket.emit('product-added-error', err.message);
            }
        });

        socket.on('delete-product', async (productId) => {
            try {
                const result = await Product.findByIdAndDelete(productId);
                const updatedProducts = await Product.find();
                io.emit('update-products', updatedProducts);

                if (result) {
                    socket.emit('product-deleted-success');
                } else {
                    socket.emit('product-deleted-error', 'Producto no encontrado.');
                }
            } catch (err) {
                socket.emit('product-deleted-error', err.message);
            }
        });

    } catch (err) {
        console.error('Error en conexión Socket.IO:', err.message);
        socket.disconnect(true);
    }
});


const PORT = 8080; 
httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});






