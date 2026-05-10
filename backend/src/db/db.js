import mongoose from 'mongoose'

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)

    console.log('MongoDB Connected')
  } catch (error) {
    console.log('Database Error', error)
    process.exit(1)
  }
}

export default connectToDb