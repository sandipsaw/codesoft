import express from 'express'
import multer from 'multer'
import Job from '../models/Job.js'
import { optionalAuth } from '../middleware/auth.js'
import { sendEmail } from '../utils/mailer.js'

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

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

router.post('/', async (req, res) => {
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

router.post('/:id/apply', optionalAuth, upload.single('resume'), async (req, res) => {
  try {
    const { name, email, message } = req.body
    const job = await Job.findById(req.params.id)
    if (!job) {
      return res.status(404).json({ error: 'Job not found' })
    }

    const application = {
      name,
      email,
      message,
      resumeName: req.file?.originalname || '',
      resumeUrl: req.file ? `/uploads/${req.file.filename}` : '',
      candidateId: req.user?.id,
    }

    job.applications.push(application)
    await job.save()

    if (email) {
      await sendEmail({
        to: email,
        subject: 'Application received',
        text: `Thank you for applying to ${job.title} at ${job.company}. Your application has been received.`,
        html: `<p>Thank you for applying to <strong>${job.title}</strong> at <strong>${job.company}</strong>.</p><p>Your application has been received and will be reviewed shortly.</p>`,
      }).catch((sendError) => {
        console.warn('Failed to send application notification', sendError)
      })
    }

    res.json({ message: 'Application submitted', application })
  } catch (error) {
    res.status(400).json({ error: 'Unable to submit application' })
  }
})

export default router
