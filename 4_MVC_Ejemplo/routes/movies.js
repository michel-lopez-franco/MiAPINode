import { Router } from 'express'
import { MovieController } from '../controllers/movies.js'

export const moviesRouter = Router()

moviesRouter.get('/', MovieController.getAll)

moviesRouter.get('/:id', MovieController.getById)

// Todo: Falta pasarlo a models
moviesRouter.get('/:id/:mas/:otro', MovieController.getParams)

moviesRouter.post('/', MovieController.create)

moviesRouter.patch('/:id', MovieController.update)

moviesRouter.put('/:id', MovieController.replace)

moviesRouter.delete('/:id', MovieController.delete)

// export default moviesRouter
