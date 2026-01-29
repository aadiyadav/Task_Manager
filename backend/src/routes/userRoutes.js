const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const { requireRole } = require('../middlewares/roleMiddleware')
const { getFirestore } = require('../config/firebase')

const router = express.Router()

// GET /api/users (admin)
router.get('/', authMiddleware, requireRole('admin'), async (req, res, next) => {
  try {
    const db = getFirestore()
    const snapshot = await db.collection('users').orderBy('name').get()

    const users = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        name: data.name || '',
        email: data.email,
        role: data.role || 'user',
      }
    })

    return res.json({ users })
  } catch (err) {
    return next(err)
  }
})

module.exports = router

