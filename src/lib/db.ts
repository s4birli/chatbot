import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/job-heaven';

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env'
    );
}

// Define the type for our cached mongoose connection
interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

// Declare the global namespace
declare global {
    namespace NodeJS {
        interface Global {
            mongoose: MongooseCache | undefined;
        }
    }
}

// Initialize the cached connection
const globalWithMongoose = global as typeof globalThis & {
    mongoose: MongooseCache | undefined;
};

let cached = globalWithMongoose.mongoose || { conn: null, promise: null };

if (!cached) {
    cached = globalWithMongoose.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connectDB; 