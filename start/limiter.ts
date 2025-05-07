/*
|--------------------------------------------------------------------------
| Define HTTP limiters
|--------------------------------------------------------------------------
|
| The "limiter.define" method creates an HTTP middleware to apply rate
| limits on a route or a group of routes. Feel free to define as many
| throttle middleware as needed.
|
*/

import limiter from '@adonisjs/limiter/services/main'

export const throttleGlobal = limiter.define('global', () => {
  return limiter.allowRequests(10).every('1 minute')
})

// Alternative security measure: blanket ban Chinese and Russian IPs
export const throttleLogin = limiter.define('login', (ctx) => {
  return (
    limiter
      .allowRequests(7)
      .every('10 minutes')
      .blockFor('6 hours')
      //Miiiiiiight return the proxy ip, test in production
      .usingKey(`ip_${ctx.request.ip()}`)
      .limitExceeded((error) => {
        error
          .setStatus(500)
          .setMessage(
            'Too many requests, either contact vladimir@vandbruno.net or wait for the cooldown to fade. This is to keep your accounts absolutely safe'
          )
      })
  )
})

export const throttleRegister = limiter.define('register', (ctx) => {
  return (
    limiter
      .allowRequests(10)
      .every('10 minutes')
      .blockFor('6 hours')
      //Miiiiiiight return the proxy ip, test in production
      .usingKey(`ip_${ctx.request.ip()}`)
      .limitExceeded((error) => {
        error
          .setStatus(500)
          .setMessage(
            'Too many requests, please check if the sign-up actually worked. If it did not - contact vladimir@vandbruno.net and I will personally make you an account. Cooldown is 6 hours if you still want to do it yourself'
          )
      })
  )
})
