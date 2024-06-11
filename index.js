import express, { json } from 'express'

import cors from 'cors'
import { moviesRouter } from './routes/movies.js'

// import movies from './movies.json' // No es valido para emacscript modules
// import movies from './movies.json' assert {type: 'json'} // Ya no existe
// import movies from './movies.json' with {type: 'json'}
// const path = require('path')

// como leer un json en ESModules
// import fs from 'node:fs'
// const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))

// Otra manera de leer un json en ESModules
/* import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const movies = require('./movies.json') */

const app = express()

app.disable('x-powered-by')

const PORT = process.env.PORT ?? 3000

app.use(json())
app.use(cors({
  origin: (origin, callback) => {
    const ACEPPTED_ORIGINS = [
      'http://localhost:5500',
      'http://localhost:3000',
      'http://movies.com',
      'http://127.0.0.1:5500',
      'https://mich.com']

    if (ACEPPTED_ORIGINS.includes(origin) || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
})
)

app.use('/movies', moviesRouter)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// La ultima a la que va allegar
app.use((req, res) => {
  res.status(404).send('<h1>404 Not Found</h1>')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`http://localhost:${PORT}`)
})
