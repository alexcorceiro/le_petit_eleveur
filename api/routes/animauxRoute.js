const express = require('express')
const { createAnimaux, getAllAnimaux, getAnimauxById, updateAnimaux, deleteAnimaux } = require('../controller/animauxController')
const uploadFiles = require('../middleware/uplaodfile')
const { authenticateJWT } = require('../middleware/authenticate')
const router = express.Router()



router.post('/', authenticateJWT, uploadFiles, createAnimaux)
router.get('/', authenticateJWT, getAllAnimaux)
router.get('/:id', authenticateJWT, getAnimauxById)
router.put('/:id', authenticateJWT, uploadFiles, updateAnimaux)
router.delete('/:id', authenticateJWT, deleteAnimaux)




module.exports = router