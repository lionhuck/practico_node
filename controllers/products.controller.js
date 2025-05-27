// const fs = require('fs').promises; // Usar la versión promisificada
// const path = require('path');

// const dbPath = path.join(__dirname, '../db/productos.json');


// const Producto = require('../models/producto'); // Importar modelo Producto 


// // Función auxiliar para leer el archivo JSON de forma asíncrona
// async function leerProductos() {
//     try {
//         const data = await fs.readFile(dbPath, 'utf-8');
//         return JSON.parse(data);
//     } catch (error) {
//         console.error('Error al leer productos:', error);
//         // Si el archivo no existe, retornar array vacío
//         if (error.code === 'ENOENT') {
//             return [];
//         }
//         throw error;
//     }
// }

// // Función auxiliar para escribir en el archivo JSON de forma asíncrona
// async function guardarProductos(data) {
//     try {
//         await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
//         console.log('Productos guardados exitosamente');
//     } catch (error) {
//         console.error('Error al guardar productos:', error);
//         throw error;
//     }
// }

// // Función para generar próximo ID de forma segura
// function generarProximoId(productos) {
//     if (productos.length === 0) return 1;
//     const maxId = Math.max(...productos.map(p => p.id));
//     return maxId + 1;
// }

// const getProductos = async (req, res) => {
//     try {
//         const productos = await leerProductos();
//         res.json({
//             data: productos,
//             status: 200,
//             message: 'Listado de productos'
//         });
//     } catch (error) {
//         console.error('Error en getProductos:', error);
//         res.status(500).json({
//             status: 500,
//             message: 'Error interno del servidor al obtener productos'
//         });
//     }
// };


// // Función para obtener todos los productos
// // const getProductos = async (req, res) => {
// //     try {
// //         const productos = await leerProductos();
// //         res.json({ 
// //             data: productos, 
// //             status: 200, 
// //             message: 'Listado de productos' 
// //         });
// //     } catch (error) {
// //         console.error('Error en getProductos:', error);
// //         res.status(500).json({ 
// //             status: 500, 
// //             message: 'Error interno del servidor al obtener productos' 
// //         });
// //     }
// // };

// // Función para obtener un producto por ID
// const getProducto = async (req, res) => {
//     try {
//         const productos = await leerProductos();
//         const producto = productos.find(item => item.id === parseInt(req.params.id));
        
//         if (!producto) {
//             return res.status(404).json({ 
//                 status: 404, 
//                 message: 'Producto no encontrado' 
//             });
//         }
        
//         res.json({ 
//             data: producto, 
//             status: 200, 
//             message: 'Producto encontrado' 
//         });
//     } catch (error) {
//         console.error('Error en getProducto:', error);
//         res.status(500).json({ 
//             status: 500, 
//             message: 'Error interno del servidor al obtener producto' 
//         });
//     }
// };

// // Función para crear un producto
// const createProducto = async (req, res) => {
//     try {
//         const { nombre, precio } = req.body;
        
//         // Validaciones
//         if (!nombre || precio === undefined || precio === null) {
//             return res.status(400).json({ 
//                 status: 400, 
//                 message: 'Nombre y precio son obligatorios' 
//             });
//         }

//         if (typeof precio !== 'number' || precio < 0) {
//             return res.status(400).json({ 
//                 status: 400, 
//                 message: 'El precio debe ser un número válido mayor o igual a 0' 
//             });
//         }

//         const productos = await leerProductos();
        
//         // Verificar nombre único (opcional, puedes quitarlo si permites nombres duplicados)
//         if (productos.some(p => p.nombre.toLowerCase() === nombre.toLowerCase().trim())) {
//             return res.status(400).json({ 
//                 status: 400,
//                 message: 'Ya existe un producto con ese nombre' 
//             });
//         }

//         const nuevoProducto = {
//             id: generarProximoId(productos),
//             nombre: nombre.trim(),
//             precio: parseFloat(precio)
//         };

//         productos.push(nuevoProducto);
//         await guardarProductos(productos);

//         res.status(201).json({ 
//             data: nuevoProducto, 
//             status: 201, 
//             message: 'Producto creado exitosamente' 
//         });
        
//     } catch (error) {
//         console.error('Error en createProducto:', error);
//         res.status(500).json({ 
//             status: 500,
//             message: 'Error interno del servidor al crear producto' 
//         });
//     }
// };

// // Función para actualizar un producto
// const actualizarProducto = async (req, res) => {
//     try {
//         const productos = await leerProductos();
//         const productoIndex = productos.findIndex(item => item.id === parseInt(req.params.id));

//         if (productoIndex === -1) {
//             return res.status(404).json({ 
//                 status: 404, 
//                 message: 'Producto no encontrado' 
//             });
//         }

//         const { nombre, precio } = req.body;

//         // Validaciones
//         if (!nombre || precio === undefined || precio === null) {
//             return res.status(400).json({ 
//                 status: 400, 
//                 message: 'Nombre y precio son obligatorios' 
//             });
//         }

//         if (typeof precio !== 'number' || precio < 0) {
//             return res.status(400).json({ 
//                 status: 400, 
//                 message: 'El precio debe ser un número válido mayor o igual a 0' 
//             });
//         }

//         // Verificar nombre único (excluyendo el producto actual)
//         const nombreExiste = productos.some(p => 
//             p.nombre.toLowerCase() === nombre.toLowerCase().trim() && 
//             p.id !== parseInt(req.params.id)
//         );
        
//         if (nombreExiste) {
//             return res.status(400).json({ 
//                 status: 400,
//                 message: 'Ya existe otro producto con ese nombre' 
//             });
//         }

//         // Actualizar producto
//         productos[productoIndex] = {
//             ...productos[productoIndex],
//             nombre: nombre.trim(),
//             precio: parseFloat(precio)
//         };

//         await guardarProductos(productos);

//         res.json({ 
//             data: productos[productoIndex], 
//             status: 200, 
//             message: 'Producto actualizado exitosamente' 
//         });
        
//     } catch (error) {
//         console.error('Error en actualizarProducto:', error);
//         res.status(500).json({ 
//             status: 500,
//             message: 'Error interno del servidor al actualizar producto' 
//         });
//     }
// };

// // Función para eliminar un producto
// const eliminarProducto = async (req, res) => {
//     try {
//         const productos = await leerProductos();
//         const productoIndex = productos.findIndex(item => item.id === parseInt(req.params.id));

//         if (productoIndex === -1) {
//             return res.status(404).json({ 
//                 status: 404, 
//                 message: 'Producto no encontrado' 
//             });
//         }

//         const productoEliminado = productos[productoIndex];
//         productos.splice(productoIndex, 1);
        
//         await guardarProductos(productos);

//         res.json({ 
//             data: productoEliminado,
//             status: 200, 
//             message: 'Producto eliminado exitosamente' 
//         });
        
//     } catch (error) {
//         console.error('Error en eliminarProducto:', error);
//         res.status(500).json({ 
//             status: 500,
//             message: 'Error interno del servidor al eliminar producto' 
//         });
//     }
// };

// module.exports = {
//     getProductos,
//     getProducto,
//     createProducto,
//     actualizarProducto,
//     eliminarProducto
// };










const Producto = require('../models/producto'); // Modelo Sequelize

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
        console.error('Error en getProductos:', error);
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
<<<<<<< HEAD
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
=======
            return res.status(400).json({ 
                status: 400, 
                message: 'El precio debe ser un número válido mayor o igual a 0' 
            });
        }

        // Actualizar producto
        productos[productoIndex] = {
            ...productos[productoIndex],
            nombre: nombre.trim(),
            precio: parseFloat(precio)
        };

        await guardarProductos(productos);

        res.json({ 
            data: productos[productoIndex], 
            status: 200, 
            message: 'Producto actualizado exitosamente' 
>>>>>>> 70fcaa900196b99bf050af43cdd5b484f8c7d39d
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
