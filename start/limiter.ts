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
export const throttleLogin = limiter.define('login', () => {
  return limiter.allowRequests(5).every('10 minutes').blockFor('6 hours')
})

export const throttleRegister = limiter.define('register', () => {
  return limiter.allowRequests(10).every('10 minutes').blockFor('6 hours')
})
