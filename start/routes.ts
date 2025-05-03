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

router
  .group(() => {
    router.post('/register', [RegisterController, 'store']).as('register.store')
  })
  .prefix('auth')
  .as('auth')

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
*/
