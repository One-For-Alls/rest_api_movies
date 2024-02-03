import { pool } from "../../config/database.js"

export class MovieModel {
  static async getAll({ genre }) {
    const connection = await pool.getConnection()
    try {
      let query = `SELECT m.id,
          m.title,
          m.director,
          m.year_creation,
          m.duration,
          m.poster,
          m.rate 
        FROM movies AS m`

      if (genre) {
        query += ` INNER JOIN movie_genre mg
          ON m.id = mg.movie_id
          INNER JOIN genres as g
          ON g.id = mg.genre_id
          WHERE g.id = ?`

        const lowerCaseGenre = genre.toLowerCase()
        const [genres] = await connection.query('SELECT id FROM genres WHERE LOWER(name) = ?', [lowerCaseGenre])

        if (genres.length === 0) return []

        const [{ id }] = genres
        const [movie] = await connection.query(query, [id])

        return movie
      }
      const [movies] = await connection.query(query)
      return movies
    } catch (error) {
      console.error('Error in getAll method:', error);
      throw error;
    } finally {
      if (connection) {
        connection.release()
      }
    }
  }

  static async getById({ id }) {
    const connection = await pool.getConnection()
    try {
      const [movie] = await connection.query(`SELECT
        title,
        year_creation,
        duration,
        director,
        poster,
        rate 
      FROM movies WHERE id = ?`, [id])

      if (movie.length === 0) return false
      return movie
    } catch (error) {
      console.log('Se capturo un error: ' + error)
    } finally {
      if (connection) {
        connection.release()
      }
    }
  }

  static async create(input) {
    // const id = randomUUID()
    const [[resultUUID]] = await connection.query('SELECT UUID() as uuid')
    const { uuid } = resultUUID
    const { title, year_creation, director, duration, poster, rate } = input

    const connection = await pool.getConnection()
    try {
      await connection.query(`INSERT INTO movies 
      (id, title, year_creation, director, duration, poster, rate) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [uuid, title, year_creation, director, duration, poster, rate])

    } catch (e) {
      throw new Error('huvo un error: ', e)
    } finally {
      if (connection) {
        connection.release()
      }
    }

    try {
      const [movieCreate] = await connection.query(`SELECT
        id,
        title,
        year_creation,
        duration,
        poster,
        rate 
      FROM movies WHERE id = ?`, [uuid])

      return movieCreate
    } catch (error) {
      console.log(error)
    } finally {
      if (connection) {
        connection.release()
      }
    }
  }

  static async update({ id, input }) {
    const { title, year_creation, duration, director, poster, rate } = input
    const connection = await pool.getConnection()
    try {
      const [{ affectedRows }] = await connection.query(`UPDATE movies SET title = ? ,
      year_creation = ?,
      duration = ?,
      director = ?,
      poster = ?,
      rate = ?
      WHERE id  = ?`, [title, year_creation, duration, director, poster, rate, id])

      // result = affectedRows
      if (affectedRows === 0) return false
      return true
    } catch (error) {
      console.log('Se capturo un error: ' + error)
    } finally {
      if (connection) {
        connection.release()
      }
    }

  }

  static async delete({ id }) {
    const connection = await pool.getConnection()
    try {
      const [{ affectedRows }] = await connection.query(`DELETE FROM movies WHERE id = ?`, [id])

      if (affectedRows === 0) return false
      return true

    } catch (error) {
      console.log('Se capturo un error: ' + error)
    } finally {
      if (connection) {
        connection.release()
      }
    }
  }
}
