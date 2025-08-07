const passport = require('passport');
const local = require('passport-local');
const User = require('../../models/User');
const { createHash, isValidPassword } = require('../../utils/hash');
const JWTStrategy = require('passport-jwt').Strategy;
const LocalStrategy = local.Strategy;

// Custom extractor desde cookies
const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies.token;
    }
    return token;
};

passport.use('jwt', new JWTStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: 'secretoJWT'
}, async (jwt_payload, done) => {
    try {
        return done(null, jwt_payload.user);
    } catch (err) {
        return done(err);
    }
}));

const initializePassport = () => {
    // Registro
    passport.use('register', new LocalStrategy(
        { usernameField: 'email', passReqToCallback: true },
        async (req, email, password, done) => {
            try {
                const { first_name, last_name, age } = req.body;
                const user = await User.findOne({ email });
                if (user) return done(null, false, { message: 'Usuario ya existe' });

                const newUser = await User.create({
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                });

                return done(null, newUser);
            } catch (err) {
                return done(err);
            }
        }
    ));

    // Login
    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email });
                if (!user || !isValidPassword(user, password)) {
                    return done(null, false, { message: 'Credenciales incorrectas' });
                }
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    ));
};

module.exports = initializePassport;
