const express = require('express');
const passport = require('passport');
const router = express.Router();
const sessionController = require('../controllers/sessions.controller');

router.post('/register', (req, res, next) => {
    passport.authenticate('register', { session: false }, (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(400).json({ status: 'error', message: info.message || 'Error en el registro' });
        }
        return res.json({ status: 'success', message: 'Usuario registrado' });
    })(req, res, next);
});


router.post('/login', sessionController.login);

router.post('/logout', sessionController.logout);

router.get(
    '/current',
    passport.authenticate('jwt', { session: false }),
    sessionController.current
);

module.exports = router

