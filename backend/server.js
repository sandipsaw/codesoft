import fs from 'fs'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import jobsRouter from './routes/jobs.js'
import authRouter from './routes/auth.js'
import candidateRouter from './routes/candidate.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jobboard'
const uploadsDir = './uploads'

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(uploadsDir))
app.use('/api/auth', authRouter)
app.use('/api/candidate', candidateRouter)
app.use('/api/jobs', jobsRouter)

app.get('/', (req, res) => {
  res.send({ message: 'Job Board API is running' })
})

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Failed to connect to MongoDB', error)
    process.exit(1)
  }
}

startServer()
