// Import Log model
const Log = require('../models/Log')

// Middleware to search logs by host and IP-Address
async function getLogByQuery(req, res, next) {
    let logs // Intialize logs object
    const host = req.query.host // Query host from url
    const ip_address = req.query.ip_address // Query ip-address from url 
    try {
        // Search for logs by query parameters
        if (host != null && ip_address != null) {
            logs = await Log.find({ host: host, ip_address: ip_address })
        } else if (host != null) {
            logs = await Log.find({ host: host })
        } else if (ip_address != null) {
            logs = await Log.find({ ip_address: ip_address })
        } else {
            logs = await Log.find({}) // Read all logs
        }

        // Return client-side error if no match found
        if (logs == null) {
            return res.status(404).json({ message: 'Cannot find matching log ' })
        }
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }

    res.logs = logs // Add the logs to the result
    return next()
}

module.exports = getLogByQuery // Export middleware