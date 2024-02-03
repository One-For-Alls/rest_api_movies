import { createApp } from "./app.js"
import { MovieModel } from './models/mysql/movie.js'
import { AuthModel } from './models/mysql/auth.js'

createApp({movieModel: MovieModel, authModel: AuthModel})