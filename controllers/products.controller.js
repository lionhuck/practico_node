const { Producto } = require('../models'); // Modelo Sequelize

// Obtener todos los productos
const getProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll();
        res.json({
            data: productos,
            status: 200,
            message: 'Listado de productos'
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error interno del servidor al obtener productos'
        });
    }
};

// Obtener un producto por ID
const getProducto = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        
        if (!producto) {
            return res.status(404).json({
                status: 404,
                message: 'Producto no encontrado'
            });
        }

        res.json({
            data: producto,
            status: 200,
            message: 'Producto encontrado'
        });
    } catch (error) {
        console.error('Error en getProducto:', error);
        res.status(500).json({
            status: 500,
            message: 'Error interno del servidor al obtener producto'
        });
    }
};

// Crear un nuevo producto
const createProducto = async (req, res) => {
    try {
        const { nombre, precio } = req.body;

        if (!nombre || precio === undefined || precio === null) {
            return res.status(400).json({
                status: 400,
                message: 'Nombre y precio son obligatorios'
            });
        }

        if (typeof precio !== 'number' || precio < 0) {
            return res.status(400).json({
                status: 400,
                message: 'El precio debe ser un número válido mayor o igual a 0'
            });
        }

        const existe = await Producto.findOne({
            where: { nombre: nombre.trim().toLowerCase() }
        });

        if (existe) {
            return res.status(400).json({
                status: 400,
                message: 'Ya existe un producto con ese nombre'
            });
        }

        const nuevoProducto = await Producto.create({
            nombre: nombre.trim(),
            precio
        });

        res.status(201).json({
            data: nuevoProducto,
            status: 201,
            message: 'Producto creado exitosamente'
        });
    } catch (error) {
        console.error('Error en createProducto:', error);
        res.status(500).json({
            status: 500,
            message: 'Error interno del servidor al crear producto'
        });
    }
};

// Actualizar un producto existente
const actualizarProducto = async (req, res) => {
    try {
        const { nombre, precio } = req.body;
        const id = req.params.id;

        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).json({
                status: 404,
                message: 'Producto no encontrado'
            });
        }

        if (!nombre || precio === undefined || precio === null) {
            return res.status(400).json({
                status: 400,
                message: 'Nombre y precio son obligatorios'
            });
        }

        if (typeof precio !== 'number' || precio < 0) {
            return res.status(400).json({
                status: 400,
                message: 'El precio debe ser un número válido mayor o igual a 0'
            });
        }

        const otroProducto = await Producto.findOne({
            where: {
                nombre: nombre.trim().toLowerCase(),
                id: { $ne: id } // Sequelize v5 o anterior
                // id: { [Op.ne]: id } // Sequelize v6 en adelante (requiere importar `Op` de `Sequelize`)
            }
        });

        if (otroProducto) {
            return res.status(400).json({
                status: 400,
                message: 'Ya existe otro producto con ese nombre'
            });
        }

        producto.nombre = nombre.trim();
        producto.precio = precio;
        await producto.save();

        res.json({
            data: producto,
            status: 200,
            message: 'Producto actualizado exitosamente'
        });
    } catch (error) {
        console.error('Error en actualizarProducto:', error);
        res.status(500).json({
            status: 500,
            message: 'Error interno del servidor al actualizar producto'
        });
    }
};

// Eliminar un producto
const eliminarProducto = async (req, res) => {
    try {
        const id = req.params.id;
        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).json({
                status: 404,
                message: 'Producto no encontrado'
            });
        }

        await producto.destroy();

        res.json({
            data: producto,
            status: 200,
            message: 'Producto eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error en eliminarProducto:', error);
        res.status(500).json({
            status: 500,
            message: 'Error interno del servidor al eliminar producto'
        });
    }
};

module.exports = {
    getProductos,
    getProducto,
    createProducto,
    actualizarProducto,
    eliminarProducto
};
