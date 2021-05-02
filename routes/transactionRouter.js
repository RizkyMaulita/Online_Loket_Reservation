const router = require('express').Router()
const { TransactionController } = require('../controllers/index.js')

router.post('/purchase/:event_id', TransactionController.createPurchase)
router.get('/get_info/:transaction_id', TransactionController.getDetailTransaction)

module.exports = router