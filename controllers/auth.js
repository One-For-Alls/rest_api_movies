import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export class AuthController {
  constructor({ authModel }) {
    this.authModel = authModel
  }

  login = async (req, res) => {
    const { email, password } = req.body

    try {
      const [user] = await this.authModel.findByEmail({ email })

      if(user && await bcrypt.compare(password, user.password)){
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email
        }
        const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '1h'})
        res.json(token)
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
  }

  getUserInfo = async (req, res) => {
    console.log(req.user)
    return res.json({user: req.user})
  }
}