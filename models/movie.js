import { readJSON } from '../utils.js'
import { randomUUID } from 'node:crypto'
const movies = readJSON('../movies.json')

export class MovieModel {
  static getAll = async ({ genre, year = {} }) => {
    if (genre && year) {
      const filteredMovies = movies.filter(
        // movie => movie.genre.includes(genre)
        movie => movie.genre.some(
          g => g.toLowerCase() === genre.toLowerCase()
        )
      ).filter(movie => movie.year === parseInt(year))
      return filteredMovies
    }

    if (genre) {
      const filteredMovies = movies.filter(
        // movie => movie.genre.includes(genre)
        movie => movie.genre.some(
          g => g.toLowerCase() === genre.toLowerCase()
        )
      )
      return filteredMovies
    }

    if (year) {
      const filteredMovies = movies.filter(
        movie => movie.year === parseInt(year))

      return filteredMovies
    }
  }

  static async getById ({ id }) {
    const movie = movies.find(movie => movie.id === id)
    return movie
  }

  static async create (input) {
    const newMovie = {
      id: randomUUID(), // uuid v4
      ...input
    }
    console.log('New movie:')
    console.log(newMovie)
    movies.push(newMovie)

    return newMovie
  }

  static async delete ({ id }) {
    const index = movies.findIndex(movie => movie.id === id)
    if (index === -1) {
      return false
    }

    movies.splice(index, 1)
    return true
  }

  static async update ({ id, input }) {
    const index = movies.findIndex(movie => movie.id === id)
    if (index === -1) {
      return false
    }

    const updatedMovie = {
      ...movies[index],
      ...input
    }

    movies[index] = updatedMovie
    console.log('Updated movie:')
    console.log(updatedMovie)

    return updatedMovie
  }
}