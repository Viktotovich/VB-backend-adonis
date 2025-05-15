import User from '#models/user'
import UserProfile from '#models/user_profile'
import { updateProfileValidator } from '#validators/profile'
import type { HttpContext } from '@adonisjs/core/http'
import { v2 as cloudinary } from 'cloudinary'

export default class ProfilesController {
  //Change to make it globally viewable
  async getAvatar({ request, response }: HttpContext) {
    const username = request.param('username')
    const foundUser = await User.findBy('username', username)

    if (!foundUser) {
      return response.notFound({ message: 'Could not find the user' })
    }

    return response.json({ avatarUrl: foundUser.avatarUrl })
  }

  async update({ request, response, auth }: HttpContext) {
    const user = auth.user

    //We have the middleware doing this, but TypeScript enforces this
    if (!user) {
      return response.unauthorized()
    }

    //Authed user trying to change another user's profile
    if (user.id !== Number(request.param('userId'))) {
      return response.unauthorized()
    }

    //Validate and accept
    const validatedData = await request.validateUsing(updateProfileValidator)

    //User profile will always exist
    const userProfile = await UserProfile.findBy('owner_id', user.id)

    if (!userProfile || userProfile.ownerId !== user.id) {
      return response.unauthorized()
    }

    //Filter undefined data
    const filteredData = Object.fromEntries(
      Object.entries(validatedData).filter(([_, value]) => value !== undefined)
    )

    //Merge all the properties into the userProfile
    userProfile.merge(filteredData)
    await userProfile.save()

    return response.ok({ message: 'Profile updated succesfully', profileData: userProfile })
  }

  //Other users can see other users' profiles
  async public({ request, response, auth }: HttpContext) {
    const user = auth.user
    const username = request.param('username')

    const foundUser = await User.findBy('username', username)

    if (!foundUser) {
      return response.notFound({ message: 'Could not find the user profile' })
    }

    const userProfile = await UserProfile.findBy('owner_id', foundUser.id)
    if (!userProfile) {
      return response.notFound({ message: 'Could not find the user profile' })
    }

    const profileData = {
      userProfile: userProfile,
      userData: {
        fullname: foundUser.fullname,
        username: foundUser.username,
        avatarUrl: foundUser.avatarUrl,
        posts: foundUser.posts,
        likes: foundUser.likes,
        roleId: foundUser.roleId,
      },
    }

    if (!user) {
      return response.json({
        profileData: profileData,
        editable: false,
      })
    }

    if (foundUser.id === user.id) {
      return response.json({
        profileData: profileData,
        editable: true,
      })
    }

    //user is authenticated, but not the owner of the profile
    return response.json({
      profileData: profileData,
      editable: false,
    })
  }

  async private({ response, auth }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized()
    }

    const userProfile = await UserProfile.findBy('owner_id', user.id)

    if (!userProfile) {
      return response.notFound()
    }

    const profileData = {
      userProfile: userProfile,
      userData: {
        fullname: user.fullname,
        username: user.username,
        avatarUrl: user.avatarUrl,
        posts: user.posts,
        likes: user.likes,
        roleId: user.roleId,
      },
    }

    return response.json({
      profileData: profileData,
      editable: true,
    })
  }

  async uploadAvatar({ request, response, auth }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized()
    }

    const avatarFile = request.file('avatarUrl', {
      size: '1mb',
      extnames: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
    })

    if (!avatarFile) {
      return response.badRequest({ error: 'No avatar file uploaded' })
    }

    if (!avatarFile.isValid) {
      return response.badRequest({ error: avatarFile.errors })
    }

    const tmpPath = avatarFile.tmpPath

    if (!tmpPath) {
      return response.internalServerError({ error: 'Could not access file path' })
    }

    try {
      const result = await cloudinary.uploader.upload(tmpPath, {
        folder: 'avatars',
        public_id: `user_${user.id}`,
        overwrite: true,
      })

      user.avatarUrl = result.secure_url
      await user.save()

      return response.json({ avatarUrl: result.secure_url })
    } catch (err) {
      console.error(err)
      return response.internalServerError({ error: 'Upload to Cloudinary failed' })
    }
  }

  getAvatarPrivate({ response, auth }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized()
    }

    return response.json({ avatarUrl: user.avatarUrl })
  }
}
