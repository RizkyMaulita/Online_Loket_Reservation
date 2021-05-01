const mainRouter = require('express').Router()
const eventRouter = require('./eventRouter.js')
const transactionRouter = require('./transactionRouter.js')

mainRouter.use('/event', eventRouter)
mainRouter.use('/transaction', transactionRouter)

module.exports = mainRouter