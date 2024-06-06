const express = require('express')
const crypto = require('node:crypto')
const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')
// const path = require('path')

const app = express()

app.disable('x-powered-by')

const PORT = process.env.PORT ?? 3000

app.use(express.json())

app.get('/movies', (req, res) => {
  const { genre, year } = req.query // query params

  if (genre && year) {
    const filteredMovies = movies.filter(
      // movie => movie.genre.includes(genre)
      movie => movie.genre.some(
        g => g.toLowerCase() === genre.toLowerCase()
      )
    ).filter(movie => movie.year === parseInt(year))
    return res.json(filteredMovies)
  }

  if (genre) {
    const filteredMovies = movies.filter(
      // movie => movie.genre.includes(genre)
      movie => movie.genre.some(
        g => g.toLowerCase() === genre.toLowerCase()
      )
    )
    return res.json(filteredMovies)
  }

  if (year) {
    const filteredMovies = movies.filter(
      movie => movie.year === parseInt(year))

    return res.json(filteredMovies)
  }

  res.json(movies)
})

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
    id: crypto.randomUUID(), // uuid v4
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
