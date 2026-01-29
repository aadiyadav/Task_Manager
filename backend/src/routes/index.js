const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const { requireRole } = require('../middlewares/roleMiddleware')
const authRoutes = require('./authRoutes')
const taskRoutes = require('./taskRoutes')
const userRoutes = require('./userRoutes')

const router = express.Router()

router.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Auth routes
router.use('/auth', authRoutes)

// Task routes
router.use('/tasks', taskRoutes)

// User routes
router.use('/users', userRoutes)

// Example protected routes
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Protected route', user: req.user })
})

router.get('/admin-only', authMiddleware, requireRole('admin'), (req, res) => {
  res.json({ message: 'Admin route', user: req.user })
})

module.exports = router

