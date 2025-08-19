const { Usuario } = require('../models');
const bcrypt = require('bcrypt');


// Obtener todos los usuarios
const getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json({ status: 200, data: usuarios });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error al obtener usuarios', error: error.message });
    }
};

// Obtener usuario por ID
const getUsuarioById = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ status: 404, message: 'Usuario no encontrado' });
        }
        res.json({ status: 200, data: usuario });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error al obtener usuario', error: error.message });
    }
};

// Crear nuevo usuario
const createUsuario = async (req, res) => {
    const { nombre, email, age, rol } = req.body;
    try {
        if (!nombre || !email || !age ) {
            return res.status(400).json({ status: 400, message: 'Faltan campos obligatorios' });
        }

        const hashedPassword = await bcrypt.hash('hola1234', 10);

        const nuevoUsuario = await Usuario.create({ nombre, email, age, rol: req.body.rol || 'cliente', password: hashedPassword });
        res.status(201).json({ status: 201, data: nuevoUsuario, message: 'Usuario creado exitosamente' });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error al crear usuario', error: error.message });
    }
};

// Editar usuario
const updateUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ status: 404, message: 'Usuario no encontrado' });
        }

        const { nombre, email, age, rol, isAdmin } = req.body;
        usuario.nombre = nombre || usuario.nombre;
        usuario.email = email || usuario.email;
        usuario.age = age || usuario.age;
        usuario.rol = rol || usuario.rol; 

        await usuario.save();

        res.status(200).json({ status: 200, message: 'Usuario editado exitosamente', data: usuario });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error al editar usuario', error: error.message });
    }
};

// Eliminar usuario
const deleteUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ status: 404, message: 'Usuario no encontrado' });
        }

        await usuario.destroy();

        res.status(200).json({ status: 200, message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error al eliminar usuario', error: error.message });
    }
};


const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { rol } = req.body;

        // Validar que el rol sea válido
        const validRoles = ['admin', 'moderador', 'cliente'];
        if (!validRoles.includes(rol)) {
            return res.status(400).json({ 
                status: 400, 
                message: 'Rol inválido. Debe ser: admin, moderador o cliente' 
            });
        }

        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ status: 404, message: 'Usuario no encontrado' });
        }

        // Actualizar rol e isAdmin basado en el rol
        usuario.rol = rol;
        await usuario.save();

        res.json({ 
            status: 200, 
            message: 'Rol actualizado exitosamente', 
            data: usuario 
        });
    } catch (error) {
        res.status(500).json({ 
            status: 500, 
            message: 'Error al actualizar rol', 
            error: error.message 
        });
    }
};


module.exports = {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    updateUserRole,
};
