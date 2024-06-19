import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  database: 'moviesdb',
  password: 'admin'
}

const connection = await mysql.createConnection(config)

export class MovieModel {
  static async getAll ({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()

      const [genres] = await connection.query(
        'SELECT id, name FROM genre WHERE LOWER(name) = ?;',
        [lowerCaseGenre]
      )

      if (genres.length === 0) {
        return []
      }
      const [{ id }] = genres

      const [moviesId] = await connection.query('SELECT bin_to_uuid(movies_id) movies_id FROM movie_genres WHERE genre_id = ?;', [id])

      const movieIds = moviesId.map(movie => movie.movies_id)
      // const placeholders = moviesId.map((movie) => `UUID_TO_BIN(${movie.movies_id})`).join(', ')
      const placeholders = moviesId.map(() => 'uuid_to_bin(?)').join(', ')

      // uuid_to_bin(6edf4475-2db4-11ef-9f5c-40b07612212d), uuid_to_bin(6edf4548-2db4-11ef-9f5c-40b07612212d
      const sql = `
      SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) AS id 
      FROM movie 
      WHERE id IN (${placeholders})`

      const [results] = await connection.query(sql, movieIds)
      //      const [results] = await connection.query(sql)

      console.log(results)
      return results
    }

    const [movies] = await connection.execute(
      'select title, year, director, duration, poster, rate, bin_to_uuid(id) id from movie;')
    console.log(movies)
    return movies
  }

  static async getById ({ id }) {
    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) AS id 
       FROM movie WHERE id = UUID_TO_BIN(?);`, [id])

    if (movies.length === 0) return null

    return movies[0]
  }

  static async create ({ input }) {
    const {
      genre: genreInput,
      title,
      year,
      duration,
      director,
      rate,
      poster
    } = input

    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    try {
      await connection.query(
          `INSERT INTO movie (id,title, year, duration, director, rate, poster) 
           VALUES (UUID_TO_BIN(?),?, ?, ?, ?, ?, ?);`,
          [uuid, title, year, duration, director, rate, poster]
      )
    } catch (e) {
      // que no lo vea el usuario
      // console.log(e)
      throw new Error('Error creating movie')
    }
    const [movies] = await connection.query(`
        SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) AS id
        FROM movie
        WHERE id = UUID_TO_BIN(?);`, [uuid])

    // console.log(movies[0])
    return movies[0]
  }

  static async delete ({ id }) {
    try {
      await connection.query('DELETE FROM movie WHERE id = UUID_TO_BIN(?);', [id])
      console.log('deleted')
      return 'deleted'
    } catch (e) {
      console.log('not deleted')
      return 'not deleted'
    }
  }

  static async update ({ id, input }) {
    const {
      genre: genreInput,
      title,
      year,
      duration,
      director,
      rate,
      poster
    } = input

    try {
      await connection.query(
          `UPDATE movie 
           SET title = ?, year = ?, duration = ?, director = ?, rate = ?, poster = ? 
           WHERE id = UUID_TO_BIN(?);`,
          [title, year, duration, director, rate, poster, id]
      )
    } catch (e) {
      throw new Error('Error updating movie')
    }

    const [movies] = await connection.query(`
        SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) AS id
        FROM movie
        WHERE id = UUID_TO_BIN(?);`, [id])

    return movies[0]
  }
}
