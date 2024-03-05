import { MovieModel } from "../models/mysql/movie.js"
import { api, cleanTableDatabase, initialMovies, getAllMoviesTest, movieForCreate } from "./helpers.js"


// const api = supertest(createapi({ movieModel: MovieModel }))

beforeAll(async () => {
  await cleanTableDatabase({ table: 'movie_genre' })
  await cleanTableDatabase({ table: 'movies' })
  await MovieModel.create(initialMovies[0])
  await MovieModel.create(initialMovies[1])
})

describe('test endpoints movies', () => {
  test('movies return json formatter', async () => {
    await api.get('/movies')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two movies', async () => {
    const { response } = await getAllMoviesTest()
    expect(response.body).toHaveLength(initialMovies.length)
  })

  test('first movie have as title digimon', async () => {
    const { content } = await getAllMoviesTest()
    expect(content).toContain('digimon')
  })

  test('creating one movie', async () => {
    const movie = movieForCreate

    await api
      .post('/movies')
      .send(movie)
      .expect('Content-Type', /application\/json/)
      .expect(201)

    const { response } = await getAllMoviesTest()
    expect(response.body).toHaveLength(initialMovies.length + 1)
  })

  test('deleting an existing movie', async () => {
    const { response: firstResponse } = await getAllMoviesTest()
    const { body: movie } = firstResponse
    const movieDelete = movie[0]

    await api.delete(`/movies/${movieDelete.id}`)
      .expect(204)

    const { response: secondRespose } = await getAllMoviesTest()
    expect(secondRespose.body).toHaveLength(initialMovies.length)
  })

  test('a movie that do not exist can not be deleted', async () => {

    await api.delete(`/movies/1234`)
      .expect(404)
  
    const { response } = await getAllMoviesTest()
    expect(response.body).toHaveLength(initialMovies.length)
  })
})
