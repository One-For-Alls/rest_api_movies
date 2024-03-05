import { pool } from '../config/database.js'
import supertest from "supertest"
import express, { json } from 'express'
import { createMoviesRouter } from '../routes/movies.js'
import { createAuthRouter } from '../routes/auth.js'
import { corsMiddleware } from '../middlewares/cors.js'
import { MovieModel } from "../models/mysql/movie.js"
import { AuthModel } from '../models/mysql/auth.js'



const createApp = ({ movieModel, authModel }) => {
  const app = express()
  app.use(json())
  app.use(corsMiddleware())
  app.disable('x-powered-by')

  app.use('/movies', createMoviesRouter({ movieModel }))
  app.use('/auth', createAuthRouter({ authModel }))
  
 return app
}

export const api = supertest(createApp({ movieModel: MovieModel, authModel: AuthModel }))

export const initialMovies = [
  {
    title: 'digimon',
    year_creation: 2023,
    director: 'anthony',
    duration: 120,
    poster: 'img',
    rate: 9.8,
    date: '2023-01-01'
  },
  {
    title: 'pokemon',
    year_creation: 2022,
    director: 'anthony z',
    duration: 110,
    poster: 'img',
    rate: 9.7,
    date: '2023-10-31'
  }
]

export const movieForCreate = {
  title: 'shaolin soccer',
  year_creation: 2017,
  director: 'stephen chow',
  duration: 185,
  poster: 'https://i.ebayimg.com/images/g/yokAAOSw8w1YARbm/s-l1200.jpg',
  genre: [
    "Comedy"
  ],
  rate: 7.8,
  date: '2022-01-01'
}

export const cleanTableDatabase = async ({ table }) => {
  await pool.execute(`DELETE FROM ${table}`)
}

export const getAllMoviesTest = async () => {
  const response = await api.get('/movies')
  const content = response.body.map(movie => movie.title)
  return {
    response,
    content
  }
}