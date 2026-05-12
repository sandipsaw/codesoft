import dotenv from 'dotenv'
dotenv.config()

import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const JWT_SECRET=process.env.JWT_SECRET 

export async function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization;
  
 if (!authorization || !authorization.startsWith('Bearer ')){
    return res.status(401).json({ error: 'Authentication required' })
  }

  const token = authorization.split(' ')[1]
  // console.log(token)
  // console.log("header",req.headers)
  // console.log("auth-->",req.headers.authorization)
  // const token = req.cookies.token
  // if(!token){
  //   return res.status(401).json({
  //     message : "unauthorized Access"
  //   })
  // }
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(payload.userId).select('-passwordHash')
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' })
    }
    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export async function optionalAuth(req, res, next) {
  const authorization = req.headers.authorization
  if (!authorization?.startsWith('Bearer ')) {
    return next()
  }
  console.log(req.headers)
  console.log(req.headers.authorization)

  // if (!authorization || !authorization.startsWith('Bearer ')){
  //   return res.status(401).json({ error: 'Authentication required' })
  // }

  const token = authorization.split(' ')[1]
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(payload.userId).select('-passwordHash')
    if (user) {
      req.user = user
    }
  } catch (error) {
    // ignore invalid tokens for optional authentication
  }

  next()
}
