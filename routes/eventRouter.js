const router = require('express').Router()
const { EventController } = require('../controllers/index.js')

router.post('/create', EventController.createEvent)
router.post('/ticket/create', EventController.Ticket.createTicket)
router.get('/get_info/:event_id', EventController.getDetailEvent)

module.exports = router