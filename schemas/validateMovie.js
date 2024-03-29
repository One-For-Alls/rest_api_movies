import { z } from 'zod'

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'El titulo debe ser texto',
    required_error: 'titulo es requerido'
  }),
  year_creation: z.number().int().min(1900).max(2024),
  director: z.string(),
  duration: z.number().int().positive(),
  poster: z.string().url({
    message: 'El poster debe ser una url'
  }),
  genre: z.array(
    z.enum([
      'Action',
      'Adventure',
      'Comedy',
      'Drama',
      'Fantasy',
      'Horror',
      'Thriller',
      'Sci-fi',
      'Anime',
      'Drama'
    ]),
    {
      invalid_type_error: 'El genero debe ser un array',
      required_error: 'genero es requerido'
    }
  ),
  rate: z.number().min(0).max(10).default(0),
  date: z.string().refine((val) => {
    // Expresión regular para validar el formato YYYY-MM-DD
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(val) && !isNaN(new Date(val).getTime());
  }, {
    message: "La fecha debe estar en el formato YYYY-MM-DD y ser una fecha válida.",
  })
})

export function validaCreateteMovie(obj) {
  return movieSchema.safeParse(obj)
}
export function validaUpdateteMovie(obj) {
  return movieSchema.partial().safeParse(obj)
}