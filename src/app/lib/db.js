import mongoose from 'mongoose'

const MONGODB_URI = "mongodb://admin:admin@localhost:27017 12/todo?authSource=admin"

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local',
  )
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {

  if (cached.conn) {
    return {
      returncode: 200,
      message: "Connection Established",
      output: cached.conn
    }
  }

  try {

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
      }
      cached.promise = await mongoose.connect(MONGODB_URI, opts).then(mongoose => {
        return mongoose
      });
    }
    cached.conn = await cached.promise
    return {
      returncode: 200,
      message: "Connection Established",
      output: cached.conn
    }

  } catch (e) {
    cached.promise = null
    return {
      returncode: 500,
      message: `Error Establishing Connection:- ${e}`,
      output: []
    }
  }

}

export default dbConnect
