// Import router from Express
const express = require('express')
const router = express.Router()

// Import Log model
const Log = require('../models/Log')

// Import middlewares
const validateApiKey = require('../middlewares/validateApiKey')
const getLogByQuery = require('../middlewares/getLogByQuery')
const getLogById = require('../middlewares/getLogById')

// Endpoint to read logs
router.get('/', validateApiKey, getLogByQuery, async (_, res) => {
    try {
        return res.json(res.logs)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
})

// Endpoint to read logs at the specified ID
router.get('/:id', validateApiKey, getLogById, (_, res) => {
    return res.json(res.log)
})

// Endpoint to create and post a log
router.post('/', validateApiKey, async (req, res) => {
    const log = new Log({
        host: req.body.host,
        ip_address: req.body.ip_address,
        data: req.body.data
    })
    try {
        const newLog = await log.save()
        return res.status(201).json(newLog)
    } catch (e) {
        return res.status(400).json({ message: e.message })
    }
})

// Endpoint to update the log at the specified ID
router.patch('/:id', validateApiKey, getLogById, async (req, res) => {
    if (req.body.host != null) {
        res.log.host = req.body.host
    }
    if (req.body.name != null) {
        res.log.name = req.body.name
    }
    if (req.body.data != null) {
        res.log.data = req.body.data
    }
    try {
        const updatedLog = await res.log.save()
        return res.json(updatedLog)
    } catch (e) {
        return res.status(400).json({ message: e.message })
    }
})

// Endpoint to delete the log at the specified ID
router.delete('/:id', validateApiKey, getLogById, async (req, res) => {
    try {
        await res.log.deleteOne()
        return res.json({ message: 'Log deleted' })
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
})

module.exports = router // Export router