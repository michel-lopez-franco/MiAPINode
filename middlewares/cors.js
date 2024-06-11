import cors from 'cors'

const ACEPPTED_ORIGINS = [
  'http://localhost:5500',
  'http://localhost:3000',
  'http://movies.com',
  'http://127.0.0.1:5500',
  'https://mich.com']

export const corsMiddleware = ({ acceptedOrigins = ACEPPTED_ORIGINS } = {}) => (cors({
  origin: (origin, callback) => {
    if (acceptedOrigins.includes(origin)) {
      callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }
    callback(new Error('Not allowed by CORS'))
  }
})
)
