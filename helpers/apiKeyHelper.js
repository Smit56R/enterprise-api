// Import custom .env file
require('dotenv').config()

// Import crypto library
const crypto = require('crypto')

// Import uuid package
const uuid = require('uuid').v4

// Generate API Key using uuid package
const generateApiKey = uuid

// Function to hash value using SHA-512 algorithm
const hash = (value) => {
    const algorithm = 'sha512'
    const secret = process.env.DEVELOPER_SECRET || 'developer_secret'
    return crypto.createHmac(algorithm, secret).update(value).digest('hex')
}

// Export helper functions
module.exports = {
    generateApiKey: generateApiKey,
    hash: hash
}