import { drizzle } from 'drizzle-orm/postgres-js'
import { relations } from './relations'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
    throw new Error('DATABASE_URL is not defined')
}

// Configure postgres client with better timeout and retry settings
// const client = postgres(connectionString, {
//     prepare: false,
//     max: 10, // Maximum number of connections in pool
//     idle_timeout: 20, // Close idle connections after 20 seconds
//     connect_timeout: 10, // Connection timeout in seconds
//     ssl: 'require', // Ensure SSL connection
// })

export const db = drizzle(connectionString, { relations });
