// Import custom .env file
require('dotenv').config()

// Import Developer model
const Developer = require('../models/Developer')

// Import router from express
const express = require('express')
const router = express.Router()

// Import functions from helper
const { generateApiKey, hash } = require('../helpers/apiKeyHelper')

// Import middleware
const validateDeveloperBody = require('../middlewares/validateDeveloperBody')

// Endpoint to sign up as developer
router.post('/signup', validateDeveloperBody, postDeveloper)

// Function to save the developer credentials + generate API key
async function postDeveloper(req, res) {
    try {
        const { body: data } = req; // Unpack body as data from req
        const { name, email, password } = data // Unpack name, email, password from data 

        const developers = await Developer.find({ email }) // Search for the email in the DB

        // Throw an error if email is already in use
        if (developers.length) {
            throw new Error('The email is already in use')
        }

        const apiKey = generateApiKey() // Generate an API Key
        const hashedApiKey = hash(apiKey) // Hash the API Key
        const hashedPassword = hash(password) // Hash the password

        // Create a new developer
        const developer = new Developer({
            name,
            email,
            password: hashedPassword,
            apiKey: hashedApiKey
        })

        // Save the new developer inside DB
        await developer.save()

        return res.status(200).json(
            {
                message: 'Success! Please check your mail.',
                apiKey: apiKey
            }
        )
    } catch (e) {
        return res.status(400).json({ message: e.message })
    }
}

module.exports = router // Export router