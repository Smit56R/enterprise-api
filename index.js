// Import custom .env file
require('dotenv').config()

// Import dependencies
const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')

// Connect to MongoDB
mongoose.connect(`${process.env.DATABASE_URL}${process.env.DATABASE_NAME}`, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json()) // Allows express to encode and decode data in json format
app.use(cors()) // Allows Cross-origin resource sharing for API

// Create and use route for logs
const logsRouter = require('./routes/logs')
app.use('/logs', logsRouter)

// Create and use route for developers
const developersRouter = require('./routes/developers')
app.use('/developers', developersRouter)

// Set port number
const PORT = 8081

// Start the server
app.listen(PORT, () => console.log("Server Started"))