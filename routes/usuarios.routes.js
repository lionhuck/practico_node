const express = require('express');
const router = express.Router();
const {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    updateUserRole,
} = require('../controllers/usuarios.controller');
const isAdmin = require('../middlewares/isAdmin');
const verifyToken = require('../middlewares/verifyToken');

// Rutas de usuarios
router.use(verifyToken); // Verificar token para todas las rutas de usuarios
router.get('/', getUsuarios);
router.get('/:id', getUsuarioById);
router.post('/',isAdmin,createUsuario);
router.put('/:id',isAdmin, updateUsuario);
router.delete('/:id',isAdmin, deleteUsuario);
router.put('/:id/rol',isAdmin, updateUserRole); 

module.exports = router;
