import { validaCreateteMovie, validaUpdateteMovie } from "../schemas/validateMovie.js"

export class MovieController {
  constructor({ movieModel }) {
    this.movieModel = movieModel
  }

  getAll = async (req, res) => {
    const { genre } = req.query
    const user = req.user

    const moviesData = await this.movieModel.getAll({ genre })

    const extractBasicInfo  = ({ title, director }) => ({
      title,
      director
    })

    const addDetailedInfo = (movie) => ({
      id: movie.id,
      director: movie.director,
      duration: movie.duration,
      poster: movie.poster,
      rate: movie.rate,
      ...extractBasicInfo (movie)
    })

    const movies = moviesData.map( movie => user ? addDetailedInfo(movie) : extractBasicInfo(movie))

    res.json(movies)
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
    return res.json({ message: 'movie deleted success' })
  }
}