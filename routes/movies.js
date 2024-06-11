import { Router } from 'express'
import { readJSON } from '../utils.js'
import { randomUUID } from 'node:crypto'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

const movies = readJSON('./movies.json')
export const moviesRouter = Router()

moviesRouter.get('/', (req, res) => {
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

moviesRouter.get('/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)

  res.status(404).json({ error: 'Movie not found' })
})

moviesRouter.get('/:id/:mas/:otro', (req, res) => {
  const { id, mas, otro } = req.params
  console.log('Parametros de la URL recibidos:')
  console.log(id, mas, otro)
  res.json(movies[id])
})

moviesRouter.post('/', (req, res) => {
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

moviesRouter.patch('/:id', (req, res) => {
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

moviesRouter.put('/:id', (req, res) => {
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

moviesRouter.delete('/:id', (req, res) => {
  const { id } = req.params
  const index = movies.findIndex(movie => movie.id === id)

  if (index === -1) {
    return res.status(404).json({ error: 'Movie not found' })
  }

  movies.splice(index, 1)
  res.json({ id })
})

// export default moviesRouter
