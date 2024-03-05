// jest.setup.js
import { pool } from "./config/database.js"

afterAll(async () => {
  await pool.end();
});
