const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const { getFirestore } = require('../config/firebase')

const USERS_COLLECTION = 'users'

function buildTokenPayload(userDoc) {
  const data = userDoc.data()
  return {
    id: userDoc.id,
    email: data.email,
    role: data.role || 'user',
  }
}

function signToken(payload) {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is not set')
  }
  return jwt.sign(payload, secret, { expiresIn: '7d' })
}

// POST /api/auth/signup
async function signup(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { email, password, name } = req.body

  try {
    const db = getFirestore()
    const usersRef = db.collection(USERS_COLLECTION)

    const existing = await usersRef.where('email', '==', email.toLowerCase()).limit(1).get()
    if (!existing.empty) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const userData = {
      email: email.toLowerCase(),
      name: name || '',
      passwordHash,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const userRef = await usersRef.add(userData)
    const userDoc = await userRef.get()

    const payload = buildTokenPayload(userDoc)
    const token = signToken(payload)

    return res.status(201).json({
      token,
      user: payload,
    })
  } catch (err) {
    return next(err)
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { email, password } = req.body

  try {
    const db = getFirestore()
    const usersRef = db.collection(USERS_COLLECTION)

    const snapshot = await usersRef.where('email', '==', email.toLowerCase()).limit(1).get()
    if (snapshot.empty) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const userDoc = snapshot.docs[0]
    const data = userDoc.data()

    const isMatch = await bcrypt.compare(password, data.passwordHash || '')
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const payload = buildTokenPayload(userDoc)
    const token = signToken(payload)

    return res.json({
      token,
      user: payload,
    })
  } catch (err) {
    return next(err)
  }
}

// GET /api/auth/me
async function getCurrentUser(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const db = getFirestore()
    const userDoc = await db.collection(USERS_COLLECTION).doc(req.user.id).get()

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' })
    }

    const payload = buildTokenPayload(userDoc)
    return res.json({ user: payload })
  } catch (err) {
    return next(err)
  }
}

// PUT /api/auth/role
async function updateRole(req, res, next) {
  try {
    const { role } = req.body
    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' })
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const db = getFirestore()
    const userRef = db.collection(USERS_COLLECTION).doc(req.user.id)

    await userRef.update({
      role,
      updatedAt: new Date().toISOString()
    })

    const updatedDoc = await userRef.get()
    const payload = buildTokenPayload(updatedDoc)

    // Issue a new token with updated role
    const token = signToken(payload)

    return res.json({
      token,
      user: payload
    })
  } catch (err) {
    return next(err)
  }
}

// GET /api/auth/users
async function getAllUsers(req, res, next) {
  try {
    const db = getFirestore()
    const snapshot = await db.collection(USERS_COLLECTION).get()

    const users = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        name: data.name,
        email: data.email,
        role: data.role
      }
    })

    return res.json({ users })
  } catch (err) {
    return next(err)
  }
}

module.exports = {
  signup,
  login,
  getCurrentUser,
  getAllUsers,
  updateRole,
}

