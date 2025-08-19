const isModerador = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    if (req.user.rol !== 'moderador') {
        return res.status(403).json({ message: 'Acceso denegado: se requiere rol admin' });
    }

    next();
};

module.exports = isModerador;
