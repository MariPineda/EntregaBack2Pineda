const jwt = require('jsonwebtoken');

const login = (req, res, next) => {
    const passport = require('passport');

    passport.authenticate('login', { session: false }, (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ status: 'error', message: info?.message || 'Error de autenticación' });

        const token = jwt.sign({ user }, 'secretoJWT', { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: false, 
            sameSite: 'lax'
        });

        res.json({ status: 'success', message: 'Login exitoso' });
    })(req, res, next);
};

const register = (req, res) => {
    res.json({ status: 'success', message: 'Usuario registrado' });
};

const logout = (req, res) => {
    res.clearCookie('token');
    res.json({ status: 'success', message: 'Sesión cerrada' });
};

const current = (req, res) => {
    res.json({ status: 'success', user: req.user });
};

module.exports = {
    login,
    register,
    logout,
    current
};
