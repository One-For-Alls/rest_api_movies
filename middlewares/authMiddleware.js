import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers.authorization
  const token = bearerHeader ? bearerHeader.slice(7, bearerHeader.length) : ''

  if (!token) return next()

  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY)
    req.user = decode
    next()
  } catch (error) {
    res.status(401).json({ message: 'Token invalido o expirado' })
  }
}