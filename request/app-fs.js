const express = require('express')
const { z } = require('zod')
const crypto = require('node:crypto')
const fs = require('node:fs/promises')
const movies = require('./movies.json')
const { error } = require('node:console')
const app = express()

app.disable('x-powered-by')

app.use(express.json())

// TODOS LOS RECURSOS QUE SEAN MOVIES SE INDENTIFICAN CON MOVIES
app.get('/movies', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filterMovie = movies.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()))
    return res.json(filterMovie)
  }
  res.json(movies)
})
app.get('/movies/:id', (req, res) => { // path-to-regexp
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)
  res.status(404).json({ message: 'movie not found' })
})
app.post('/movies', (req, res) => {
  const { title, year, director, duration, poster, genre, rate } = req.body
  
  const newMovie = {
    id: crypto.randomUUID(),
    title,
    year,
    director,
    duration,
    poster,
    genre,
    rate
  }

  addMovie(newMovie, res)

  //res.status(201).json(newMovie)

})

async function addMovie (newMovie, res) {
  try {
    movies.push(newMovie)
    await fs.writeFile('./apiRest/movies.json', JSON.stringify(movies, null, 2))
    res.status(201).send('se agrego la peli')
  } catch (error) {
    res.status(400).send('error')
    console.error('Error al procesar el archivo:', error);
  }
}

const PORT = process.env.PORT || 1234

app.listen(PORT, () => {
  console.log(`escuchando desde el puerto http://localhost:${PORT}`)
})
