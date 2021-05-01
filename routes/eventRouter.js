const router = require('express').Router()
const { EventController } = require('../controllers/index.js')

router.post('/create', EventController.createEvent)

module.exports = router