import { Router } from 'express'
import { readJSON } from '../utils.js'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'
import { MovieModel } from '../models/movie.js'
import { MovieController } from '../controllers/movies.js'

const movies = readJSON('./movies.json')
export const moviesRouter = Router()

moviesRouter.get('/', MovieController.getAll)

moviesRouter.get('/:id', async (req, res) => {
  const { id } = req.params
  const movie = await MovieModel.getById({ id })
  if (movie) return res.json(movie)

  res.status(404).json({ error: 'Movie not found' })
})

// Todo: Falta pasarlo a models
moviesRouter.get('/:id/:mas/:otro', (req, res) => {
  const { id, mas, otro } = req.params
  console.log('Parametros de la URL recibidos:')
  console.log(id, mas, otro)
  res.json(movies[id])
})

moviesRouter.post('/', async (req, res) => {
  const result = validateMovie(req.body)

  if (result.error) {
    // 422 Unprocessable Entity
    // return res.status(400).json({ error: 'Invalid movie' })
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const newMovie = await MovieModel.create({ input: result.data })

  res.status(201).json(newMovie)
})

moviesRouter.patch('/:id', async (req, res) => {
  // console.log('PATCH /movies/:id')
  const { id } = req.params
  const result = validatePartialMovie(req.body)

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const updatedMovie = await MovieModel.update({ id, input: result.data })

  res.json(updatedMovie)
})

moviesRouter.put('/:id', async (req, res) => {
  const { id } = req.params
  const result = validateMovie(req.body)

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const updatedMovie = await MovieModel.update({ id, input: result.data })

  res.json(updatedMovie)
})

moviesRouter.delete('/:id', async (req, res) => {
  const { id } = req.params

  const result = await MovieModel.delete({ id })

  if (!result) return res.status(404).json({ error: 'Movie not found' })

  res.json({ id })
})

// export default moviesRouter
