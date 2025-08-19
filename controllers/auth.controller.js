const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const register = async (req, res) => {
    const { nombre, email, age, password } = req.body;

    try {
        const existingUsuario = await Usuario.findOne({ where: { email } });
        if (existingUsuario) {
            return res.status(400).json({ status: 400, message: 'El correo electrónico ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUsuario = await Usuario.create({
            nombre,
            email,
            age,
            rol: 'cliente',
            password: hashedPassword
        });

        return res.status(201).json({ status: 201, message: 'Usuario reg`is`trado exitosamente', usuario: newUsuario });
    } catch (error) {
        console.error("Error en el registro:", error);
        return res.status(500).json({ status: 500, message: 'Error al registrar usuario', error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(404).json({ status: 404, message: 'Usuario no encontrado' });
        }

        const isPasswordValid = await bcrypt.compare(password, usuario.password);
        if (!isPasswordValid) {
            return res.status(401).json({ status: 401, message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({
            id: usuario.id,
            email: usuario.email,
            rol: usuario.rol 
        }, 'secret_key', { expiresIn: '1h' });
        return res.status(200).json({ status: 200, message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Error al iniciar sesión', error: error.message });
    }
};

module.exports = {
    register,
    login
};
