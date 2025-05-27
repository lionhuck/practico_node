const fs = require('fs').promises; // Usar la versión promisificada
const path = require('path');

const dbPath = path.join(__dirname, '../db/usuarios.json');

// Función auxiliar para leer el archivo JSON de forma asíncrona
async function leerUsuarios() {
    try {
        const data = await fs.readFile(dbPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al leer usuarios:', error);
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function guardarUsuarios(data) {
    try {
        await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
        console.log('Usuarios guardados exitosamente');
    } catch (error) {
        console.error('Error al guardar usuarios:', error);
        throw error;
    }
}
function generarProximoId(usuarios) {
    if (usuarios.length === 0) return 1;
    const maxId = Math.max(...usuarios.map(u => u.id));
    return maxId + 1;
}

const getUsuarios = async (req, res) => {
    try {
        const usuarios = await leerUsuarios();
        res.json({ data: usuarios, status: 200, message: 'Listado de usuarios' });
    } catch (error) {
        console.error('Error en getUsuarios:', error);
        res.status(500).json({ 
            status: 500, 
            message: 'Error interno del servidor al obtener usuarios' 
        });
    }
};

const getUsuario = async (req, res) => {
    try {
        const usuarios = await leerUsuarios();
        const usuario = usuarios.find(u => u.id === parseInt(req.params.id));
        
        if (!usuario) {
            return res.status(404).json({ 
                status: 404, 
                message: 'Usuario no encontrado' 
            });
        }
        
        res.json({ data: usuario, status: 200 });
    } catch (error) {
        console.error('Error en getUsuario:', error);
        res.status(500).json({ 
            status: 500, 
            message: 'Error interno del servidor al obtener usuario' 
        });
    }
};

const createUsuario = async (req, res) => {
    try {
        const { nombre, email, edad } = req.body;
        
        // Validaciones
        if (!nombre || !email || edad === undefined || edad === null) {
            return res.status(400).json({ 
                status: 400,
                message: 'Nombre, email y edad son obligatorios' 
            });
        }

        if (typeof edad !== 'number' || edad < 0) {
            return res.status(400).json({ 
                status: 400,
                message: 'La edad debe ser un número válido mayor o igual a 0' 
            });
        }

        const usuarios = await leerUsuarios();
        
        // Verificar email único
        if (usuarios.some(u => u.email === email)) {
            return res.status(400).json({ 
                status: 400,
                message: 'El email ya está registrado' 
            });
        }

        const nuevoUsuario = {
            id: generarProximoId(usuarios),
            nombre: nombre.trim(),
            email: email.trim().toLowerCase(),
            edad: parseInt(edad)
        };

        usuarios.push(nuevoUsuario);
        await guardarUsuarios(usuarios);

        res.status(201).json({ 
            data: nuevoUsuario, 
            status: 201,
            message: 'Usuario creado exitosamente' 
        });
        
    } catch (error) {
        console.error('Error en createUsuario:', error);
        res.status(500).json({ 
            status: 500,
            message: 'Error interno del servidor al crear usuario' 
        });
    }
};

const actualizarUsuario = async (req, res) => {
    try {
        const usuarios = await leerUsuarios();
        const usuarioIndex = usuarios.findIndex(u => u.id === parseInt(req.params.id));
        
        if (usuarioIndex === -1) {
            return res.status(404).json({ 
                status: 404,
                message: 'Usuario no encontrado' 
            });
        }

        const { nombre, email, edad } = req.body;

        // Validaciones
        if (!nombre || !email || edad === undefined || edad === null) {
            return res.status(400).json({ 
                status: 400,
                message: 'Nombre, email y edad son obligatorios' 
            });
        }

        if (typeof edad !== 'number' || edad < 0) {
            return res.status(400).json({ 
                status: 400,
                message: 'La edad debe ser un número válido mayor o igual a 0' 
            });
        }

        // Verificar email único (excluyendo el usuario actual)
        const emailExiste = usuarios.some(u => 
            u.email === email.trim().toLowerCase() && u.id !== parseInt(req.params.id)
        );
        
        if (emailExiste) {
            return res.status(400).json({ 
                status: 400,
                message: 'El email ya está en uso por otro usuario' 
            });
        }

        // Actualizar usuario
        usuarios[usuarioIndex] = {
            ...usuarios[usuarioIndex],
            nombre: nombre.trim(),
            email: email.trim().toLowerCase(),
            edad: parseInt(edad)
        };

        await guardarUsuarios(usuarios);
        
        res.json({ 
            data: usuarios[usuarioIndex], 
            status: 200, 
            message: 'Usuario actualizado exitosamente' 
        });
        
    } catch (error) {
        console.error('Error en actualizarUsuario:', error);
        res.status(500).json({ 
            status: 500,
            message: 'Error interno del servidor al actualizar usuario' 
        });
    }
};

const eliminarUsuario = async (req, res) => {
    try {
        const usuarios = await leerUsuarios();
        const usuarioIndex = usuarios.findIndex(u => u.id === parseInt(req.params.id));
        
        if (usuarioIndex === -1) {
            return res.status(404).json({ 
                status: 404,
                message: 'Usuario no encontrado' 
            });
        }

        const usuarioEliminado = usuarios[usuarioIndex];
        usuarios.splice(usuarioIndex, 1);
        
        await guardarUsuarios(usuarios);
        
        res.json({ 
            data: usuarioEliminado,
            status: 200,
            message: 'Usuario eliminado exitosamente' 
        });
        
    } catch (error) {
        console.error('Error en eliminarUsuario:', error);
        res.status(500).json({ 
            status: 500,
            message: 'Error interno del servidor al eliminar usuario' 
        });
    }
};

module.exports = {
    getUsuarios,
    getUsuario,
    createUsuario,
    actualizarUsuario,
    eliminarUsuario
};