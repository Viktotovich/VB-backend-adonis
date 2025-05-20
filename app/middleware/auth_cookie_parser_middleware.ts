import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AuthCookieParserMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const rawToken = ctx.request.plainCookie('auth_token')

    if (rawToken) {
      const payload = JSON.parse(Buffer.from(rawToken, 'base64').toString())
      const token = payload.message.token
      ctx.request.headers().authorization = 'Bearer ' + token
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
