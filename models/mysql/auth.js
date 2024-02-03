import { pool } from "../../config/database.js";

export class AuthModel {
  static async findByEmail ({ email }) {
    try {
      let query = 'SELECT * FROM users WHERE email = ?'
      const [user] = await pool.query(query, [email])
      
      return (user.length > 0)
        ? user
        : []
    } catch (error) {
      console.log('Huvo un error: ' + error)
    }
  }
}