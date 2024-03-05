import { pool } from "../../config/database.js";

export class AuthModel {
  static async findByEmail ({ email }) {
    const connection = await pool.getConnection()
    try {
      let query = 'SELECT * FROM users WHERE email = ?'
      const [user] = await connection.query(query, [email])
      
      return (user.length > 0)
        ? user
        : []
    } catch (error) {
      console.log('Huvo un error: ' + error)
    } finally {
      connection.release()
    }
  }
}