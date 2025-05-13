import type { HttpContext } from '@adonisjs/core/http'

export default class ProfilesController {
  async getAvatar({ response, auth }: HttpContext) {
    const user = auth.user

    return response.json({ avatarUrl: user?.avatarUrl })
  }

  async all({ response, auth }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized()
    }

    return response.json({
      profileData: {
        id: user.id,
        fullName: user.fullname,
        username: user.username,
        roleId: user.roleId,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        posts: user.posts,
        likes: user.likes,
      },
    })
  }
}
