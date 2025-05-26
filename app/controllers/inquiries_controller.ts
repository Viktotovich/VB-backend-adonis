import EmailOnlyLead from '#models/email_only_lead'
import QualityLead from '#models/quality_lead'
import type { HttpContext } from '@adonisjs/core/http'

export default class InquiriesController {
  //TODO: validators(optional?) + rateLimitor(s)
  async storeEmail({ request, response }: HttpContext) {
    const { email, hasWebsite } = request.body()

    await EmailOnlyLead.create({
      email: email,
      hasWebsite: hasWebsite,
    })

    console.log('Partial Lead Registered')

    return response.json({
      message:
        'Thank you for submitting the form, our team will get back to you as soon as possible!',
      allowDisplay: true,
    })
  }

  async storeFull({ request, response }: HttpContext) {
    //catch the request fields
    const { hasWebsite, requirements, email, phoneNumber, additionalInformation, name } =
      request.body()

    await QualityLead.create({
      hasWebsite,
      requirements,
      email,
      phoneNumber,
      additionalInformation,
      name,
    })

    console.log('Full Lead Registered')

    return response.json({
      message:
        'Thank you for submitting the form, our team will get back to you as soon as possible after carefully assessing your specific needs.',
      allowDisplay: true,
    })
  }
}
