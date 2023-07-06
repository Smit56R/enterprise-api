// Import Log model
const Log = require('../models/Log')

// Middleware to get Log by providing its ID
async function getLogById(req, res, next) {
    let log // Initialize log object
    try {
        // Search and return log by ID in the DB
        log = await Log.findById(req.params.id)

        // Return client-side error if not log found
        if (log == null) {
            return res.status(404).json({ message: 'Cannot find log ' })
        }
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }

    res.log = log // Add the log to the result
    return next()
}

module.exports = getLogById // Export middleware