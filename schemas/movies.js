const z = require('zod')

const movideSchema = z.object({
  title: z.string({
    invalid_type_error: 'Title must be a string',
    required_error: 'Title is required.'
  }),
  year: z.number().int().min(1900).max(2025),
  director: z.string(),
  duration: z.number().int().positive(),
  poster: z.string().url({
    message: 'Poster must be a valid URL'
  }), // .endsWith('.jpg')
  rate: z.number().min(0).max(10).default(5.5),
  genre: z.array(
    z.enum(['Action', 'Comedy', 'Crime', 'Drama', 'Horror', 'Sci-Fi'],
      {
        required_error: 'Genre is required',
        invalid_type_error: 'Genre must be an array of strings'
      }
    )
  )

})

function validateMovie (input) {
  /* let result
  try {
    console.log(movie)
    result = movideSchema.parse(movie)
    console.log(result)
  } catch (error) {
    // throw new Error(error.errors)
    throw new Error(JSON.stringify(error.errors))
  } */

  // console.log(movie)
  const result = movideSchema.safeParse(input)
  // console.log(result)

  return result
}

function validatePartialMovie (input) {
  return movideSchema.partial().safeParse(input)
}

module.exports = { validateMovie, validatePartialMovie }
