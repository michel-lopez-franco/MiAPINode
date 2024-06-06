const express = require('express')
const crypto = require('node:crypto')
const movies = require('./movies.json')

// const path = require('path')

const app = express()

app.disable('x-powered-by')

// ?? se llama operador de coalescencia nula
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
  const {
    title,
    year,
    director,
    duration,
    poster,
    genre,
    rate
  } = req.body

  /* if (!title || !year || !genre) {
    return res.status(400).json({ error: 'Missing fields' })
  }
  */
  const newMovie = {
    id: crypto.randomUUID(), // uuid v4
    title,
    year,
    director,
    duration,
    poster,
    genre,
    rate: rate ?? 0
  }

  movies.push(newMovie)
  res.status(201).json(newMovie)
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
