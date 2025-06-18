const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const register = async (req, res) => {
    const { nombre, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ status: 400, message: 'El correo electrónico ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create{
            nombre,
            email,
            password: hashedPassword
        };
        return res.status(201).json({ status: 201, message: 'Usuario registrado exitosamente', user: newUser });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Error al registrar usuario', error: error.message });
    }

}

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ status: 404, message: 'Usuario no encontrado' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ status: 401, message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: user.id }, 'secret_key', { expiresIn: '1h' });
        return res.status(200).json({ status: 200, message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Error al iniciar sesión', error: error.message });
    }
}