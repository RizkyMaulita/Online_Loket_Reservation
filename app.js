if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const express = require('express')
const app = express()
const port = +process.env.PORT || 3000
const cors = require('cors')
const routes = require('./routes/index.js')
const errorHandler = require('./middleware/errorHandler.js')

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(routes)
app.use(errorHandler)

app.listen(port, () => {
  console.log('Connected on port ', port)
})
