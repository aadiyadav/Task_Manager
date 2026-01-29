const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error('JWT_SECRET is not set')
    }

    const payload = jwt.verify(token, secret)
    req.user = payload
    return next()
  } catch (err) {
    console.error('JWT verification failed:', err.message)
    return res.status(401).json({ message: 'Unauthorized: Invalid token' })
  }
}

module.exports = authMiddleware

