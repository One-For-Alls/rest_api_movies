import { api } from "./helpers.js"

describe('test endpoint auth', () => {
  test('user and password are correct', async () => {
    const response = await api.post('/auth/login')
      .send({
        email: 'anthony@gmail.com',
        password: '123456'
      })
      .expect(200)

      expect(response.body).toHaveProperty('token')
      expect(response.body.token).not.toBe('')
      expect(response.body.token.split('.').length).toBe(3)
  })
})