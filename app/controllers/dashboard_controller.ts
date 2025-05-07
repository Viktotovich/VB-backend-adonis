import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  async show({ request, response, auth }: HttpContext) {
    /*separate data based on whether client is User | Student | Editor | Poster | 
    Admin */
    console.log(auth.user)

    return response.json({ message: 'success' })
  }
}
