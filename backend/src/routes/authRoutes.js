const express = require('express')
const { body } = require('express-validator')
const authMiddleware = require('../middlewares/authMiddleware')
const {
  signup,
  login,
  getCurrentUser,
  getAllUsers,
  updateRole,
} = require('../controllers/authController')

const router = express.Router()

const signupValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('name').optional().isString().isLength({ max: 100 }),
]

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').exists().withMessage('Password is required'),
]

router.post('/signup', signupValidation, signup)
router.post('/login', loginValidation, login)
router.get('/me', authMiddleware, getCurrentUser)
router.put('/role', authMiddleware, updateRole)
router.get('/users', authMiddleware, getAllUsers)

module.exports = router

