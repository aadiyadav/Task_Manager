const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const dotenv = require('dotenv')
const routes = require('./routes')

dotenv.config()

const app = express()

// Trust Proxy for Render/Vercel
app.set('trust proxy', 1)

// Security headers
app.use(helmet())

// CORS
const allowedOrigin = process.env.CORS_ORIGIN || '*'
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
)

// Body parsing
app.use(express.json())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
})
app.use('/api', limiter)

// Routes
app.use('/api', routes)

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not found' })
})

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err)
  const status = err.status || 500
  res.status(status).json({
    message: err.message || 'Internal server error',
  })
})

const PORT = process.env.PORT || 5000

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

module.exports = app
