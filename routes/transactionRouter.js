const router = require('express').Router()
const { TransactionController } = require('../controllers/index.js')

router.post('/purchase/:event_id', TransactionController.createPurchase)

module.exports = router