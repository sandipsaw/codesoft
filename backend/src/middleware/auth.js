import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const JWT_SECRET='fc59966be7e474391e90e8c54cd80d44fecb6fbd4fb5c8a700783dd6eb7c522a' 

export async function authMiddleware(req, res, next) {
//   const authorization = req.headers.authorization;
  
//  if (!authorization || !authorization.startsWith('Bearer ')){
//     return res.status(401).json({ error: 'Authentication required' })
//   }

  // const token = authorization.replace('Bearer ', '')
  const token = req.cookies.token
  if(!token){
    return res.status(401).json({
      message : "unauthorized Access"
    })
  }
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

  const token = authorization.replace('Bearer ', '')
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
