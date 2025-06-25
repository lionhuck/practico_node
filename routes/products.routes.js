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


router.get('/',verifyToken, getProductos);
router.get('/:id',verifyToken, getProducto);
router.post('/',verifyToken, createProducto);
router.put('/:id',verifyToken, actualizarProducto);
router.delete('/:id',verifyToken, eliminarProducto);

module.exports = router;  