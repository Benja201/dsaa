const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 8089;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/biblioteca_db';

app.use(cors());
app.use(bodyParser.json());

// Conexión a MongoDB con reconexión básica
mongoose.connect(mongoUri)
    .then(() => console.log('Conectado exitosamente a MongoDB:', mongoUri))
    .catch(err => console.error('Error de conexión a MongoDB:', err.message));

// Esquema de Libro
const libroSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    autor: { type: String, required: true },
    anio: { type: Number, required: true },
    categoria: { type: String, default: 'General' }
}, { timestamps: true });

const Libro = mongoose.model('Libro', libroSchema);

// Endpoint de salud
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'ej1-mongo-api', port: port });
});

// Listar todos los libros o filtrar por categoría
app.get('/libros', async (req, res) => {
    try {
        const { categoria } = req.query;
        const filtro = categoria ? { categoria: new RegExp(`^${categoria}$`, 'i') } : {};
        const libros = await Libro.find(filtro);
        res.json(libros);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener un libro por ID
app.get('/libros/:id', async (req, res) => {
    try {
        const libro = await Libro.findById(req.params.id);
        if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });
        res.json(libro);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear un nuevo libro
app.post('/libros', async (req, res) => {
    try {
        const { titulo, autor, anio, categoria } = req.body;
        if (!titulo || !autor || !anio) {
            return res.status(400).json({ error: 'Campos obligatorios: titulo, autor, anio' });
        }
        const nuevoLibro = new Libro({ titulo, autor, anio, categoria });
        await nuevoLibro.save();
        res.status(201).json(nuevoLibro);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`API MongoDB corriendo en el puerto ${port}`);
});
