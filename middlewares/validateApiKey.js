// Import custom .env file
require('dotenv').config()

// Import Developer model
const Developer = require('../models/Developer')

// Import hash function from helper
const { hash } = require('../helpers/apiKeyHelper.js')

// Function to update developer usage
const handleDeveloperUsage = async (developer) => {
    const updatedDeveloper = developer
    const isNewDay = !(updatedDeveloper.usage.date == new Date())
    updatedDeveloper.usage.date = Date.now()

    if (isNewDay) {
        updatedDeveloper.usage.count = 0
    } else {
        updatedDeveloper.usage.count += 1
    }

    return updatedDeveloper.save()
}

// Function to search developer by API key
const findDeveloper = async ({ apiKey }) => {
    const hashedApiKey = hash(apiKey)
    return await Developer.findOne({ apiKey: hashedApiKey })
}

// Middleware to validate the API key
async function validateApiKey(req, res, next) {
    try {
        // Get API key from the headers
        let apiKey = req.headers['X-API-Key'] || req.headers['x-api-key']

        // Throw an error if header does not contain any API Key
        if (!apiKey) {
            throw new Error(`X-API-Key Header doesn't exist`)
        }

        // If API key is Master then skip further validation
        if (apiKey === process.env.MASTER_KEY) {
            return next()
        }

        // Search for developer by API Key
        const developer = await findDeveloper({ apiKey })

        // If Developer exists
        if (developer) {
            // Check if developer exceeds usage limit
            if (developer.usage.count >= 2500) {
                return res.status(403).json({ message: 'You have exceeded your limit of requests per day' })
            }
            await handleDeveloperUsage(developer) // Update developer usage
            return next() // Jump to next
        }

        // Throw client-side error
        return res.status(401).json({ message: 'Your API key is invalid' })
    } catch (e) {
        return res.status(400).json({ message: e.message })
    }
}

module.exports = validateApiKey // Export middleware