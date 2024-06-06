const z = require('zod')

const movideSchema = z.object({
  title: z.string({
    invalid_type_error: 'Title must be a string',
    required_error: 'Title is required.'
  }),
  year: z.number().int().min(1900).max(2025),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10),
  poster: z.string().url({
    message: 'Poster must be a valid URL'
  }), // .endsWith('.jpg')
  genre: z.array(
    z.enum(['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi'],
      {
        required_error: 'Genre is required',
        invalid_type_error: 'Genre must be an array of strings'
      }
    )
  )
})

function validateMovie (movie) {
  /* try {
    movideSchema.parse(movie)
  } catch (error) {
    throw new Error(error.errors)
  }
  */
  return movideSchema.safeParse(movie)
}

module.exports = { validateMovie }
