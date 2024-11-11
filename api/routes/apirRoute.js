const express = require("express")
const router = express.Router()
const userRouter = require('./userRouter')
const AnimauxRouter = require('./animauxRoute')
const coupleRouter = require('./coupleRouter')
const stockRouter = require('./stockRouter')
const eventRouter = require('./eventRouter')

router.use('/users', userRouter)
router.use('/animaux', AnimauxRouter)
router.use('/couple', coupleRouter)
router.use('/stock', stockRouter)
router.use('/event', eventRouter)







module.exports = router