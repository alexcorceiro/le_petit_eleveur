const express = require('express');
const { createStock, getAllStock, getStockById, updateStock, deleteStock } = require('../controller/stockController');
const { authenticateJWT } = require('../middleware/authenticate');
const router = express.Router()


router.post('/', authenticateJWT, createStock)
router.get('/', authenticateJWT, getAllStock)
router.get('/:id', authenticateJWT, getStockById)
router.put('/:id', authenticateJWT, updateStock)
router.delete('/:id', authenticateJWT, deleteStock)


module.exports = router