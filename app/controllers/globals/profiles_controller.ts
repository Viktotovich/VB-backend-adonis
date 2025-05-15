import User from '#models/user'
import UserProfile from '#models/user_profile'
import { updateProfileValidator } from '#validators/profile'
import type { HttpContext } from '@adonisjs/core/http'

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
      },
    }

    return response.json({
      profileData: profileData,
      editable: true,
    })
  }
}
