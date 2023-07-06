// Import validator library
const validator = require('validator')

// Middleware to validate developer credentials
function validateDeveloperBody(req, res, next) {
    const { body: data } = req;

    if (!data.name) {
        return res.status(400).json({ message: 'Name is required' })
    }

    if (!data.email) {
        return res.status(400).json({ message: 'Email is required' })
    }

    if (!data.password) {
        return res.status(400).json({ message: 'Password is required' })
    }

    // Validate email using validator
    if (!validator.isEmail(data.email)) {
        return res.status(400).json({ message: 'Email is invalid' })
    }

    // Validate password using validator
    if (!validator.isStrongPassword(data.password)) {
        return res.status(400).json({ message: 'Password is not strong enough' })
    }

    return next()
}

module.exports = validateDeveloperBody // Export middleware