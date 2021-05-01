const mainRouter = require('express').Router()
const locationRouter = require('./locationRouter.js')
const eventRouter = require('./eventRouter.js')
const transactionRouter = require('./transactionRouter.js')

mainRouter.use('/location', locationRouter)
mainRouter.use('/event', eventRouter)
mainRouter.use('/transaction', transactionRouter)

module.exports = mainRouter