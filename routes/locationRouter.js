const router = require('express').Router()
const { LocationController } = require('../controllers')

router.post('/create', LocationController.createLocation)

module.exports = router