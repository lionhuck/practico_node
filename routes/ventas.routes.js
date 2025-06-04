const express = require('express');
const router = express.Router();

const {
    getSells
} = require('../controllers/ventas.controller');

router.get('/', getSells);

module.exports = router;