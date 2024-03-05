
import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://127.0.0.1:5500',
  'http://127.0.0.1:5173',
  'http://localhost:1234',
  'http://localhost:5173',
  'http://localhost',
  'http://127.0.0.1'
]

export const corsMiddleware = ({acceptedOrigins = ACCEPTED_ORIGINS} = {}) => cors({

  origin: ((origin, callback) => {
    if (acceptedOrigins.includes(origin)) {
      return callback(null, true)
    }
    if (!origin) {
      return callback(null, origin || 'htpp://localhost/1234')
    }
    return callback(new Error('Not allowed by Cors'))
  })
})