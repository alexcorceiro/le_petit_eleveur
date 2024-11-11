const express = require('express')
const { register, login, getAllUsers, getUserById, updateUserById, deleteUser, getProfile } = require('../controller/UserController')
const { authenticateJWT } = require('../middleware/authenticate')
const router = express.Router()

router.post('/inscription' , register)
router.post('/login', login)

router.get("/profile", authenticateJWT, getProfile)
router.get('/', authenticateJWT, getAllUsers)
router.get('/:id', authenticateJWT, getUserById)
router.put('/:id', authenticateJWT, updateUserById)
router.delete('/:id', authenticateJWT, deleteUser)





module.exports = router