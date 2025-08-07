const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        const acceptsHTML = req.headers.accept?.includes('text/html');
        if (acceptsHTML) {
            return res.status(403).render('unauthorized');
        } else {
            return res.status(403).send({ error: `No tiene privilegios suficientes` });
        }
    }
    next();
};

const auth = (permisos = []) => {
    return (req, res, next) => {
        if (!Array.isArray(permisos)) {
            return res.status(500).send({ error: `Problemas con los permisos de la ruta` });
        }

        permisos = permisos.map(p => p.toLowerCase());

        if (permisos.includes("public")) return next();

        if (!req.user || !req.user.role) {
            return res.status(401).send({ error: `No existen usuarios autenticados` });
        }

        if (!permisos.includes(req.user.role.toLowerCase())) {
            return res.status(403).send({ error: `No tiene privilegios suficientes para acceder al recurso solicitado` });
        }

        next();
    };
};

const requireAuth = (req, res, next) => {
    const passport = require('passport');

    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(401).render('unauthorized');
        }

        req.user = user;
        next();
    })(req, res, next);
};


module.exports = {
    isAdmin, 
    auth,
    requireAuth
};
