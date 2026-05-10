import mongoose from 'mongoose'

const applicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String },
  resumeName: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
})

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  salary: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  applications: [applicationSchema],
})

const Job = mongoose.model('Job', jobSchema)
export default Job
