import type { HttpContext } from '@adonisjs/core/http'
import UserRoles from '../../enums/user_roles.js'
import EmailOnlyLead from '#models/email_only_lead'
import QualityLead from '#models/quality_lead'

export default class AdminController {
  async show({ response, auth }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.status(200) //honeypot >> add fake data later on
    }

    if (user.roleId !== UserRoles.ADMIN) {
      return response
        .status(403)
        .json({ message: 'This is an admins only pannel | FC يرجى التواصل مع فلاد إذا كنت من' })
    }

    if (user.roleId === UserRoles.ADMIN) {
      const simpleLeads = await EmailOnlyLead.all()
      const qualityLeads = await QualityLead.all()

      return response.json({
        content: {
          simpleLeads,
          qualityLeads,
        },
      })
    }
  }
}
