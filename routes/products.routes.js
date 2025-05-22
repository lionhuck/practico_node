const express = require('express');
const router = express.Router();
const {
    getProductos,          
    getProducto,
    createProducto,
    actualizarProducto,
    eliminarProducto
} = require('../controllers/products.controller');

router.get('/', getProductos);
router.get('/:id', getProducto);
router.post('/', createProducto);
router.put('/:id', actualizarProducto);
router.delete('/:id', eliminarProducto);

module.exports = router;  