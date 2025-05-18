import User from '#models/user'
import { registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import UserRoles from '../../enums/user_roles.js'

//email related
import mail from '@adonisjs/mail/services/main'
import CreateThankYouMessage from '#start/emails/thank_you'
import UserProfile from '#models/user_profile'
import ProfileStatus from '../../enums/profile_status.js'

export default class RegisterController {
  async store({ request, response, auth }: HttpContext) {
    if (request.input('roleId')) {
      return response.unauthorized({ message: 'Lmao, you actually thought this would work?' })
    }

    //1. validate input
    try {
      const { fullname, email, password, username } = await request.validateUsing(registerValidator)

      //2. create a user if all is well
      const user = await User.create({
        fullname,
        email,
        password,
        username,
        roleId: UserRoles.USER,
      })

      //2.5 Make a user profile upon register
      await UserProfile.create({
        ownerId: user.id,
        profileStatus: ProfileStatus.INCOMPLETE,
      })

      //3. Get a valid token for the user
      const token = await auth.use('api').createToken(user, ['server:read'], {
        expiresIn: '7 days',
      })

      //3.5 Send an email to the user upon successful register
      await mail.send((message) => {
        const html = new CreateThankYouMessage(user.fullname!, new Date().getFullYear()).getHTML()
        message
          .to(email)
          .from('vladimir@vandbruno.net')
          .subject('Welcome to your new internet home, ' + user.fullname)
          .html(html)
      })

      response.cookie('auth_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })

      //4. Return to frontend
      return response.json({ allowRedirect: true, userId: user.id })
    } catch (err) {
      console.error(err)
      //test with errors, duplicate emails and other things
      return response.json({
        allowRedirect: false,
        status: 'failed',
        messages: err.messages || ['Something went wrong'],
      })
    }
  }
}
