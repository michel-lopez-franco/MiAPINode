import express, { json } from 'express'
import { randomUUID } from 'node:crypto'
import { validateMovie, validatePartialMovie } from './schemas/movies.js'
import cors from 'cors'
import { readJSON } from './utils.js'

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
const movies = readJSON('./movies.json')

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

app.get('/movies', (req, res) => {})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)

  res.status(404).json({ error: 'Movie not found' })
})

// Ejemplo con mas parametros
app.get('/movies/:id/:mas/:otro', (req, res) => {
  const { id, mas, otro } = req.params
  console.log('Parametros de la URL recibidos:')
  console.log(id, mas, otro)
  res.json(movies[id])
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  if (result.error) {
    // 422 Unprocessable Entity
    // return res.status(400).json({ error: 'Invalid movie' })
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: randomUUID(), // uuid v4
    ...result.data
  }
  console.log('New movie:')
  console.log(newMovie)
  movies.push(newMovie)
  res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
  // console.log('PATCH /movies/:id')
  const { id } = req.params
  const result = validatePartialMovie(req.body)

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const index = movies.findIndex(movie => movie.id === id)
  if (index === -1) {
    return res.status(404).json({ error: 'Movie not found' })
  }

  const updatedMovie = {
    ...movies[index],
    ...result.data
  }

  movies[index] = updatedMovie
  console.log('Updated movie:')
  console.log(updatedMovie)
  res.json(updatedMovie)
})

app.put('/movies/:id', (req, res) => {
  const { id } = req.params
  const result = validateMovie(req.body)

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const index = movies.findIndex(movie => movie.id === id)
  if (index === -1) {
    return res.status(404).json({ error: 'Movie not found' })
  }

  const updatedMovie = {
    id,
    ...result.data
  }

  movies[index] = updatedMovie
  console.log('Updated movie:')
  console.log(updatedMovie)
  res.json(updatedMovie)
})

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const index = movies.findIndex(movie => movie.id === id)

  if (index === -1) {
    return res.status(404).json({ error: 'Movie not found' })
  }

  movies.splice(index, 1)
  res.json({ id })
})

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
