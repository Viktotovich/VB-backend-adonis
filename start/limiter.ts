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

export const throttlePosts = limiter.define('likes', (ctx) => {
  return (
    limiter
      .allowRequests(10)
      .every('60 minutes')
      .blockFor('24 hours')
      //Miiiiiiight return the proxy ip, test in production
      .usingKey(`ip_${ctx.request.ip()}`)
      .limitExceeded((error) => {
        error
          .setStatus(429)
          .setMessage(
            "Thanks for contributing to V and Bruno! We appreciate your enthusiasm! You've reached the maximum number of posts allowed within a short time. Our platform is small, relatively new, and prone to DDOS attacks. To protect our platform and ensure fair use, we've temporarily disabled new posts for a while. Please try again after a day"
          )
      })
  )
})

export const throttleLikes = limiter.define('likes', (ctx) => {
  return (
    limiter
      .allowRequests(50)
      .every('10 minutes')
      .blockFor('24 hours')
      //Miiiiiiight return the proxy ip, test in production
      .usingKey(`ip_${ctx.request.ip()}`)
      .limitExceeded((error) => {
        error
          .setStatus(429)
          .setMessage(
            'Thanks for leaving likes, we are glad you are finding the content enjoyable. However, our system currently is relatively new and small and can handle only so much, it cannot tell whether it is a DDOS attempt or genuinely 50 likes in 10 minutes. Hence, we have to temporarily disable likes. It honestly guts and saddens me as a developer, I am genuinely sorry from the bottom of my heart - Vlad'
          )
      })
  )
})
