const express = require('express');
const router = express.Router();

const {
    getSells,
    getSellById,
    createSell,
    deleteSell,
    updateSell
} = require('../controllers/ventas.controller');
router.get('/', getSells);
router.get('/:id', getSellById);
router.post('/', createSell);
router.delete('/:id', deleteSell);
router.put('/:id', updateSell);

module.exports = router;