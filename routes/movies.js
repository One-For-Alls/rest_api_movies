import { Router } from "express"
import { MovieController } from "../controllers/movie.js"
import { verifyToken } from "../middlewares/authMiddleware.js"

export const createMoviesRouter = ({  movieModel }) => {

  const moviesRouter = Router()
  const movieController = new MovieController({ movieModel })
  
  moviesRouter.get('/', verifyToken, movieController.getAll)
  moviesRouter.get('/categories', movieController.getCategories)
  moviesRouter.get('/last', movieController.getLast)
  moviesRouter.get('/best_movies', movieController.getBestMovies)
  moviesRouter.get('/more_views', movieController.getMoreViews)
  moviesRouter.get('/:id', movieController.getId)
  moviesRouter.post('/', movieController.create)
  moviesRouter.patch('/:id', movieController.update)
  moviesRouter.delete('/:id', movieController.delete)

  return moviesRouter
}