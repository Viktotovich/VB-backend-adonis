import { updateProfileValidator } from '#validators/profile'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfilesController {
  async getAvatar({ response, auth }: HttpContext) {
    const user = auth.user

    return response.json({ avatarUrl: user?.avatarUrl })
  }

  async update({ request, response, auth }: HttpContext) {
    //https://tailwindflex.com/@nejaa-badr/profile-page << Reference
    const user = auth.user

    //We have the middleware doing this, but TypeScript enforces this
    if (!user) {
      return response.unauthorized()
    }

    //Authed user trying to change another user's profile
    if (auth.user !== request.param('userId')) {
      return response.unauthorized()
    }

    //Validate and accept
    const {
      bio,
      linkedinUrl,
      instagramUrl,
      additionalUrl,
      additionalUrlName,
      mobileNumber,
      profileTitle,
    } = await request.validateUsing(updateProfileValidator)

    //Create a new profile if doesnt exist
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
