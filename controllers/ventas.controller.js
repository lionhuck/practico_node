const {Venta, Usuario, Producto} = require('../models')

const getSells = async (req, res) => {
    try {
        const ventas = await Venta.findAll({
            include: [ Usuario, Producto ]
        });
        res.json({ status: 200, data: ventas });
    }
    catch (error) {
        res.status(500).json({ status: 500, message: 'Error al obtener ventas', error: error.message });
    }
}

const getSellById = async (req, res) => {
    const { id } = req.params;
    try {
        const venta = await Venta.findByPk(id, {
            include: [ Usuario, Producto ]
        });
        if (!venta) {
            return res.status(404).json({ status: 404, message: 'Venta no encontrada' });
        }
        res.json({ status: 200, data: venta });
    }
    catch (error) {
        res.status(500).json({ status: 500, message: 'Error al obtener la venta', error: error.message });
    }
}

const createSell = async (req, res) => {
    const { usuarioId, productoId, cantidad } = req.body;
    try {
        const nuevaVenta = await Venta.create({
            usuarioId,
            productoId,
            cantidad
        });
        res.status(201).json({ status: 201, data: nuevaVenta });
    }
    catch (error) {
        res.status(500).json({ status: 500, message: 'Error al crear la venta', error: error.message });
    }
}

const deleteSell = async (req, res) => {
    const { id } = req.params;
    try {
        const venta = await Venta.findByPk(id);
        if (!venta) {
            return res.status(404).json({ status: 404, message: 'Venta no encontrada' });
        }
        await venta.destroy();
        res.json({ status: 200, message: 'Venta eliminada exitosamente' });
    }
    catch (error) {
        res.status(500).json({ status: 500, message: 'Error al eliminar la venta', error: error.message });
    }
}

const updateSell = async (req, res) => {
    const { id } = req.params;
    const { usuarioId, productoId, cantidad } = req.body;
    try {
        const venta = await Venta.findByPk(id);
        if (!venta) {
            return res.status(404).json({ status: 404, message: 'Venta no encontrada' });
        }
        venta.usuarioId = usuarioId;
        venta.productoId = productoId;
        venta.cantidad = cantidad;
        await venta.save();
        res.json({ status: 200, data: venta });
    }
    catch (error) {
        res.status(500).json({ status: 500, message: 'Error al actualizar la venta', error: error.message });
    }
}

module.exports = {
    getSells,
    getSellById,
    createSell,
    deleteSell,
    updateSell
}