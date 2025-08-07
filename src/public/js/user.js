const socket = io();

// Crear producto
document.getElementById('create-product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const dataProducto = { title, description, price }; 
    socket.emit('new-product', dataProducto);
});

// Actualizar producto
socket.on('update-products', products => { 
    const productsList = document.getElementById('productsList');
    productsList.innerHTML = '';
    products.forEach(p => {
        const li = document.createElement('li');
        li.innerText = `${p.title} - $${p.price}`;
        productsList.appendChild(li);
    });
});

// Actualizar lista de productos
socket.on('products', (products) => {
    const productos = document.getElementById('products-list');
    productos.innerHTML = '';
    products.forEach((producto) => {
        const productHTML = `
            <div>
                <h2>${producto.title}</h2>
                <p>${producto.description}</p>
                <p>Precio: ${producto.price}</p>
            </div>
        `;
        productos.innerHTML += productHTML;
    });
});