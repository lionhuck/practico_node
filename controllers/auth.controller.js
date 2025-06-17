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