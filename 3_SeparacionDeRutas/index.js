import express, { json } from 'express'

import { moviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'

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

app.use(corsMiddleware())

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
