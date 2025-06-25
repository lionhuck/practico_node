const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) return res.status(403).json({ status: 403, message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    console.log('Token:', token);

    try{
        const decodedToken = jwt.verify(token, 'secret_key');
        req.usuarioId = decodedToken.id;
        next();
    } catch (error) {
        return res.status(401).json({ status: 401, message: 'Invalid token' });
    }
}

module.exports =verifyToken;