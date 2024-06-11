import { MovieModel } from '../models/movie.js'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

export class MovieController {
  static async getAll (req, res) {
    const { genre, year } = req.query // query params
    const movies = await MovieModel.getAll({ genre, year })
    res.json(movies)
  }

  static async getById (req, res) {
    const { id } = req.params
    const movie = await MovieModel.getById({ id })
    if (movie) return res.json(movie)

    res.status(404).json({ error: 'Movie not found' })
  }

  static async create (req, res) {
    const result = validateMovie(req.body)

    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newMovie = await MovieModel.create({ input: result.data })

    res.status(201).json(newMovie)
  }

  static async delete (req, res) {
    const { id } = req.params

    const result = await MovieModel.delete({ id })

    if (!result) return res.status(404).json({ error: 'Movie not found' })

    res.json({ id })
  }

  static async update (req, res) {
    const { id } = req.params
    const result = validatePartialMovie(req.body)

    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const updatedMovie = await MovieModel.update({ id, input: result.data })

    res.json(updatedMovie)
  }

  static async replace (req, res) {
    const { id } = req.params
    const result = validateMovie(req.body)

    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const updatedMovie = await MovieModel.update({ id, input: result.data })

    res.json(updatedMovie)
  }

  static async getParams (req, res) {
    const { id, mas, otro } = req.params
    console.log('Parametros de la URL recibidos en el controlador:')
    console.log(id, mas, otro)
    const movies = MovieModel.getParams({ id, mas, otro })

    res.json(movies)
  }
}
