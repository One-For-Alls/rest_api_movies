import { validaCreateteMovie, validaUpdateteMovie } from "../schemas/validateMovie.js"

export class MovieController {
  constructor({ movieModel }) {
    this.movieModel = movieModel
  }

  getAll = async (req, res) => {
    const { genre } = req.query
    const user = req.user

    const moviesData = await this.movieModel.getAll({ genre })

    console.log(genre)

    const extractBasicInfo  = ({ id, title, director, poster, date, genre_id, genre_name }) => ({
      id,
      title,
      director,
      poster,
      date,
      genre_id,
      genre_name
    })

    const addDetailedInfo = (movie) => ({
      director: movie.director,
      duration: movie.duration,
      rate: movie.rate,
      ...extractBasicInfo (movie)
    })

    const movies = moviesData.map( movie => user ? addDetailedInfo(movie) : extractBasicInfo(movie))

    res.json(movies)
  }

  getLast = async (req, res) => {
    const {page, limit} = req.query

    const lastMovies = await this.movieModel.getLast({page, limit})
    if(lastMovies) return res.json(lastMovies)
    return res.status(404).json({message: 'not found movies'})
  }
  getBestMovies = async (req, res) => {

    const bestMovies = await this.movieModel.getBestMovies()
    if(bestMovies) return res.json(bestMovies)
    return res.status(404).json({message: 'not found best movies'})
  }
  getMoreViews = async (req, res) => {

    const moreViews = await this.movieModel.getMoreViews()
    console.log(moreViews)
    if(moreViews) return res.json(moreViews)
    return res.status(404).json({message: 'not found movies more views'})
  }

  getCategories = async (req, res) => {
    const categories = await this.movieModel.getCategories()
    if (categories) return res.json(categories)
    res.status(400).json({ message: 'categories is empty' })
  }

  getId = async (req, res) => {
    const { id } = req.params
    const movies = await this.movieModel.getById({ id })

    if (movies) return res.json(movies)
    res.status(400).json({ message: 'movie not found' })
  }

  create = async (req, res) => {
    const result = validaCreateteMovie(req.body)

    if (result.error) return res.status(404).json({ error: JSON.parse(result.error.message) })

    const newMovie = await this.movieModel.create(result.data)

    res.status(201).json(newMovie)
  }

  update = async (req, res) => { // actualiza todo o parcialemente el codigo

    const result = validaUpdateteMovie(req.body)

    if (result.error) return res.status(400).json({ error: JSON.parse(result.error.message) })

    const { id } = req.params
    const updateMovie = await this.movieModel.update({ id, input: result.data })

    if (!updateMovie) return res.status(404).json({ message: 'movie not found' })
    return res.json({ message: 'movie updated!' })
  }

  delete = async (req, res) => {
    const { id } = req.params
    const result = await this.movieModel.delete({ id })

    if (!result) return res.status(404).json({ message: 'movie not found' })
    return res.status(204).json({ message: 'movie deleted success' })
  }
}