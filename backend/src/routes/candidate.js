import express from 'express'
import Job from '../models/Job.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.get('/applications', authMiddleware, async (req, res) => {
  try {
    
    
    const jobs = await Job.find({ 'applications.candidateId': req.user._id })
     
    const applications = []

    jobs.forEach((job) => {
      job.applications
        .filter((application) => application.candidateId?.toString() === req.user._id.toString())
        .forEach((application) => {
          applications.push({
            jobId: job._id,
            title: job.title,
            company: job.company,
            location: job.location,
            salary: job.salary,
            resumeUrl: application.resumeUrl,
            resumeName: application.resumeName,
            message: application.message,
            appliedAt: application.createdAt,
          })
        })
    })

    res.json( applications)
  } catch (error) {
    res.status(500).json({ error: 'Unable to load applications' })
  }
})

export default router
