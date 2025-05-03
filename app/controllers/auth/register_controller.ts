import User from '#models/user'
import { registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import UserRoles from '../../enums/user_roles.js'

export default class RegisterController {
  async store({ request, response, auth }: HttpContext) {
    //1. validate input
    const { fullname, email, password, username } = await request.validateUsing(registerValidator)

    //2. create a user if all is well
    const user = await User.create({
      fullname,
      email,
      password,
      username,
      roleId: UserRoles.USER,
    })

    //3. Using the user data, sign-them in and send back a token
    response.send('success')
  }
}
