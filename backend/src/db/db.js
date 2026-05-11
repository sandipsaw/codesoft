import mongoose from 'mongoose'

const connectToDb = async (uri) => {
  try {
    await mongoose.connect(uri)

    console.log('MongoDB Connected')
  } catch (error) {
    console.log('Database Error', error)
    process.exit(1)
  }
}

export default connectToDb