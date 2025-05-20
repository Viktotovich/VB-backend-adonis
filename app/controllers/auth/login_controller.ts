import User from '#models/user'
import { loginValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class LoginController {
  async store({ request, response }: HttpContext) {
    //1. Validate input
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      //Good scenario -- everything a-ok
      //2. Verify credentials
      const user = await User.verifyCredentials(email, password)
      const token = await User.accessTokens.create(user, ['server:read'], {
        expiresIn: '7 days',
      })

      //3. Return access tokens
      response.plainCookie('auth_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        domain: '.vandbruno.net',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })

      return response.ok({
        allowRedirect: true,
        userId: user.id,
      })
    } catch (err) {
      //Bad Scenario -- something went wrong
      console.error('User login error: ' + err)
      return response.unauthorized({ messages: 'Invalid email or password' })
    }
  }
}
