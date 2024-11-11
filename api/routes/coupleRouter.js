const express = require('express')
const { createCouple, getAllCouple, getCoupleById, updateCouple, deleteCouple } = require('../controller/coupleController')
const { authenticateJWT } = require('../middleware/authenticate')
const router = express.Router()

router.post('/', authenticateJWT, createCouple)
router.get('/', authenticateJWT, getAllCouple)
router.get('/:id', authenticateJWT, getCoupleById)
router.put('/:id', authenticateJWT, updateCouple)
router.delete('/:id', authenticateJWT, deleteCouple)







module.exports = router