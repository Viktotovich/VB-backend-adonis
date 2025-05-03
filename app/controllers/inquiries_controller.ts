import type { HttpContext } from '@adonisjs/core/http'

export default class InquiriesController {
  //TODO: validators(optional?) + rateLimitor(s)
  async storeEmail({ request, response }: HttpContext) {
    const email = request.input('email')

    return response.json({
      message:
        'Thank you for submitting the form, our team will get back to you as soon as possible',
    })
  }

  async storeFull({ request, response }: HttpContext) {
    //catch the request fields
    return response.json({
      message:
        'Thank you for submitting the form, our team will get back to you as soon as possible after carefully assessing your specific needs.',
    })
  }
}
