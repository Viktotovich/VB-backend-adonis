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
