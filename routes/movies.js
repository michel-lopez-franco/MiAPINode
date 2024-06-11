import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
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
