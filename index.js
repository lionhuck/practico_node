const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3000;

// Middleware para manejar CORS
app.use(cors());

app.use(express.json());

const usuarioRouter = require('./routes/usuarios.routes');
app.use('/usuarios', usuarioRouter);

const productosRouter = require('./routes/products.routes');
app.use('/productos', productosRouter);

const ventasRouter = require('./routes/ventas.routes');
app.use('/ventas', ventasRouter);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
