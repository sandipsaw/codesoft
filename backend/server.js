import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import fs from 'fs'
import express from 'express'
import connectToDb from './src/db/db.js'
import cors from 'cors'
import jobsRouter from './src/routes/jobs.js'
import authRouter from './src/routes/auth.js'
import candidateRouter from './src/routes/candidate.js'

const app = express()

const PORT = process.env.PORT || 3000
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jobboard'

// const uploadsDir = './uploads'

// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true })
// }


app.use(express.json())
app.use(cookieParser())

// app.use(cors({
//     origin: [
//       'https://talent-hub247.vercel.app', 
//       'http://localhost:5173', 
//       'https://codesoft-2fak.onrender.com'],
//     credentials: true
// }));

app.use(cors({
  origin: [
    'https://talenthub-ebon.vercel.app',
    'https://talent-hub247.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}))

// app.use('/uploads', express.static(uploadsDir))
app.use('/api/auth', authRouter)
app.use('/api/candidate', candidateRouter)
app.use('/api/jobs', jobsRouter)

app.get('/', (req, res) => {
  res.send({ message: 'Job Board API is running' })
})

async function startServer() {
  try {
    await connectToDb(MONGO_URI)
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server', error)
    process.exit(1)
  }
}

startServer()

// const notes = [] 

// app.post("/home",(req,res)=>{
//   console.log(req.body);
//   notes.push(req.body)
//   res.json({
//     message:"Notes added successfully",
//     notes:notes
//   })
// })


// async function startServer() {
//   try {
//     await mongoose.connect(MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     })

//     app.listen(PORT, () => {
//       console.log(`Server listening on http://localhost:${PORT}`)
//     })
//   } catch (error) {
//     console.error('Failed to connect to MongoDB', error)
//     process.exit(1)
//   }
// }

// startServer()
