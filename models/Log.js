// Import mongoose
const mongoose = require('mongoose')

// Schema for Log
const LogSchema = mongoose.Schema({
    host: {
        type: String,
        require: true
    },
    ip_address: {
        type: String,
        require: true
    },
    data: {
        type: Object,
        require: true
    }
})

module.exports = mongoose.model('Log', LogSchema) // Export Log model