import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import multer from 'multer'
import uploadFile from '../Services/imagekit.service.js'
import Job from '../models/Job.js'
import { authMiddleware } from '../middleware/auth.js'

import transporter from '../Services/nodemailer.service.js'

const router = express.Router()
const storage = multer.memoryStorage()

const upload = multer({
  storage
})


router.get('/', async (req, res) => {

  try {
    const search = req.query.search?.trim()
    const filter = search
      ? {
        $or: [
          { title: new RegExp(search, 'i') },
          { company: new RegExp(search, 'i') },
          { location: new RegExp(search, 'i') },
          { description: new RegExp(search, 'i') },
        ],
      }
      : {}

    const jobs = await Job.find(filter).sort({ createdAt: -1 })
    res.json(jobs)
  } catch (error) {
    res.status(500).json({ error: 'Unable to load jobs' })
  }
})

router.post('/', authMiddleware, async (req, res) => {

  try {
    const job = new Job(req.body)
    const savedJob = await job.save()
    res.status(201).json(savedJob)
  } catch (error) {
    res.status(400).json({ error: 'Invalid job data' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
    if (!job) {
      return res.status(404).json({ error: 'Job not found' })
    }
    res.json(job)
  } catch (error) {
    res.status(500).json({ error: 'Unable to load job details' })
  }
})

router.post('/:id/apply', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    const { name, email, message } = req.body

    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({ error: 'Job not found' })
    }

    let resumePDF = {
      url: '',
      id: ''
    }

    // Upload resume
    if (req.file) {
      try {
        const uploadedResume = await uploadFile({
          buffer: req.file.buffer
        })

        resumePDF = {
          url: uploadedResume.url,
          id: uploadedResume.id
        }

      } catch (uploadError) {
        console.log('Resume upload failed:', uploadError)
      }
    }
    console.log(req.body)
    console.log(req.file)
    console.log(email)

    const application = {
      name,
      email,
      message,
      resumeName: req.file?.originalname || '',
      resumeUrl: resumePDF.url,
      candidateId: req.user?._id,
    }

    job.applications.push(application)

    await job.save()

    // FAST RESPONSE
    res.json({
      message: 'Application submitted successfully',
      application
    })

    // EMAIL IN BACKGROUND
    if (email) {
      console.log('Before sending email')

      transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: email,

        subject: `Application Received - ${job.title}`,

        text: `
Hello ${name},

Thank you for applying for the ${job.title} position at ${job.company}.

We have successfully received your application.

Best regards,
TalentHub Team
    `,

        html: `
<div style="font-family: Arial; padding:20px">
  <h2>TalentHub</h2>

  <p>Hello <strong>${name}</strong>,</p>

  <p>
    Thank you for applying for
    <strong>${job.title}</strong> at
    <strong>${job.company}</strong>.
  </p>

  <p>Your application has been received successfully.</p>

  <br/>

  <p>Best regards,</p>
  <p><strong>TalentHub Team</strong></p>
</div>
    `
      })
        .then((info) => {
          console.log('Email sent successfully')
          console.log(info.messageId)
        })
        .catch((err) => {
          console.log('Email sending failed')
          console.log(err)
        })

      console.log('After sending email')
    }

  } catch (error) {
    console.log(error)

    res.status(500).json({
      error: 'Unable to submit application'
    })
  }
})
export default router