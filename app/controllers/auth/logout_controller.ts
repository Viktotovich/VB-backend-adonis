import type { HttpContext } from '@adonisjs/core/http'

export default class LogoutController {
  async logout({ response, auth }: HttpContext) {
    await auth.use('api').invalidateToken()
    response.clearCookie('auth_token')

    response.json({ message: 'success', allowRedirect: true })
  }
}
