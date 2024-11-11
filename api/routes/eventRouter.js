const express = require('express')
const { createEventement, getEvents, getEventById, updateEvent, deleteEvent } = require('../controller/eventController')
const router = express.Router()

router.post('/', createEventement)
router.get('/', getEvents)
router.get('/:id', getEventById)
router.put('/:id', updateEvent)
router.delete('/:id', deleteEvent)


module.exports = router