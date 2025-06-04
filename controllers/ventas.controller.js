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

module.exports = {
    getSells
}