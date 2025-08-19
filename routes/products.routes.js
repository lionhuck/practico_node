const express = require('express');
const router = express.Router();
const {
    getProductos,          
    getProducto,
    createProducto,
    actualizarProducto,
    eliminarProducto
} = require('../controllers/products.controller');
const verifyToken = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');
const isModerador = require('../middlewares/isModerador');

router.get('/',verifyToken, getProductos);
router.get('/:id',verifyToken, getProducto);
router.post('/',verifyToken, isModerador || isAdmin, createProducto);
router.put('/:id',verifyToken,isModerador || isAdmin, actualizarProducto);
router.delete('/:id',verifyToken,isAdmin, eliminarProducto);

module.exports = router;  