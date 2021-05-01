const router = require('express').Router()
const { EventController } = require('../controllers/index.js')

router.post('/create', EventController.createEvent)
router.post('/ticket/create', EventController.Ticket.createTicket)

module.exports = router