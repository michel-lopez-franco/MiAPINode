import { MovieModel } from '../models/movies'

export class MovieController {
  static async getAll (req, res) {
    const { genre, year } = req.query // query params
    const movies = await MovieModel.getAll({ genre, year })

    res.json(movies)
  }
}
