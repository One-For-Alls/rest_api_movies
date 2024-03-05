import express, { json } from 'express'
import { createMoviesRouter } from './routes/movies.js'
import { createAuthRouter } from './routes/auth.js'
import { corsMiddleware } from './middlewares/cors.js'

export const createApp = ({ movieModel, authModel }) => {
  const app = express()
  app.use(json())
  app.use(corsMiddleware())
  app.disable('x-powered-by')

  app.use('/movies', createMoviesRouter({ movieModel }))
  app.use('/auth', createAuthRouter({ authModel }))
  
  const PORT = process.env.PORT || 1234
  
  app.listen(PORT, () => {
    console.log(`escuchando desde el puerto http://localhost:${PORT}/movies`)
  })
}
