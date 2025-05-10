import type { HttpContext } from '@adonisjs/core/http'

export default class ProfilesController {
  async getAvatar({ response, auth }: HttpContext) {
    const user = auth.user

    return response.json({ avatarUrl: user?.avatarUrl })
  }
}
