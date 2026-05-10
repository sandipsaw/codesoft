import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET
console.log(JWT_SECRET);

const TOKEN_EXPIRES_IN = '7d'

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' })
  }

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = new User({ name, email, passwordHash })
    await user.save()

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN })

    res.cookie('token',token,{
      maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false
    })
    res.status(201).json({ message:"user registered succesfully",
       token,
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email 
        } 
      })
  } catch (error) {
    res.status(500).json({ error: 'Unable to register user' })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash)
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN })

    res.cookie('token', token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false
    })

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (error) {
    res.status(500).json({ message: error.message, error: 'Unable to complete login' })
  }
})

router.get('/me', authMiddleware, async (req, res) => {
  res.json(req.user)
  
})

router.put('/me', authMiddleware, async (req, res) => {
  const { name, email } = req.body
  try {
    if (name) req.user.name = name
    if (email) req.user.email = email
    await req.user.save()
    res.json({ id: req.user._id, name: req.user.name, email: req.user.email })
  } catch (error) {
    res.status(400).json({  error: 'Unable to update profile' })
  }
})

export default router
