/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

//Controllers
const RegisterController = () => import('#controllers/auth/register_controller')
const LoginController = () => import('#controllers/auth/login_controller')
const InquiriesController = () => import('#controllers/inquiries_controller')
const DashboardController = () => import('#controllers/dashboard_controller')

//Rate Limitors
import { throttleLogin, throttleRegister, throttleGlobal } from './limiter.js'
import { middleware } from './kernel.js'

//Auth Router
router
  .group(() => {
    router
      .post('/register', [RegisterController, 'store'])
      .as('register.store')
      .use([throttleRegister])

    router.post('/login', [LoginController, 'store']).as('login.store').use([throttleLogin])

    //create a sign-out route
  })
  .prefix('auth')
  .as('auth')

//Inquiry Router ---- Leads API
router
  .group(() => {
    router.post('/simple', [InquiriesController, 'storeEmail']).as('inquiry.simple')
    router.post('/full', [InquiriesController, 'storeFull']).as('inquiry.full')
  })
  .prefix('/inquiry')
  .as('inquiry')
  .use([throttleGlobal])

//Dashboard Router
router
  .group(() => {
    router.get('/', [DashboardController, 'show']).as('dashboard.show')
  })
  .prefix('/dashboard-data')
  .as('dashboard-data')
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )

/*
  TODOs:
  1 - Inquiry table without auth to receive people who come to the landing page and
    fill out the forms

  2 - Have the frontend change from form to thank you component on successful submit

  3 - Rate limitor, never trust the client

  4 - Inquiries in the admin view + email, have the backend send the emails to
  clients with a generic text, thank you, and timeline + something useful

  5 - Somehow ensure that only the frontend can send that data, probs CORS + 
  some form of XSS protection

  6 - Consider making a honeypot route
*/
