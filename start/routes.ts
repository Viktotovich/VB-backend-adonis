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
const PostsController = () => import('#controllers/posts_controller')
const ProfilesController = () => import('#controllers/globals/profiles_controller')
const LogoutController = () => import('#controllers/auth/logout_controller')
const AdminController = () => import('#controllers/confidential/admin_controller')

//Rate Limitors
import {
  throttleLogin,
  throttleRegister,
  throttleGlobal,
  throttleLikes,
  throttlePosts,
} from './limiter.js'
import { middleware } from './kernel.js'

//Auth Router
router
  .group(() => {
    router
      .post('/register', [RegisterController, 'store'])
      .as('register.store')
      .use([throttleRegister])

    router.post('/login', [LoginController, 'store']).as('login.store').use([throttleLogin])

    router.post('/logout', [LogoutController, 'logout']).as('logout.clear')
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
  .prefix('/dashboard')
  .as('dashboard')
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )

//Posts Router
router
  .group(() => {
    router.post('/new', [PostsController, 'store']).as('posts.store').use([throttlePosts])
    router.post('/:postId/like', [PostsController, 'like']).as('post.like').use([throttleLikes])
  })
  .prefix('/posts')
  .as('posts')
  .use(middleware.auth({ guards: ['api'] }))

//Profile Router
router
  .group(() => {
    // Protected: only the owner can update their profile
    router
      .get('/private/avatar', [ProfilesController, 'getAvatarPrivate'])
      .as('profile.avatar.private')
      .use(middleware.auth({ guards: ['api'] }))
    router
      .put('/:userId/', [ProfilesController, 'update'])
      .as('profile.update')
      .use(middleware.auth({ guards: ['api'] }))
    router
      .get('/', [ProfilesController, 'private'])
      .as('profile.private')
      .use(middleware.auth({ guards: ['api'] }))
    router
      .post('/upload-avatar', [ProfilesController, 'uploadAvatar'])
      .as('profile.upload')
      .use(middleware.auth({ guards: ['api'] }))

    // Public routes
    router.get('/:username', [ProfilesController, 'public']).as('profile.public')
    router.get('/:username/avatar', [ProfilesController, 'getAvatar']).as('profile.getAvatar')
  })
  .prefix('/profile')
  .as('profile')

//Admins Only Router
router
  .group(() => {
    router.get('/', [AdminController, 'show']).as('admin.show')
  })
  .prefix('/admins') //admins because /admin is something bots will sniff out
  .as('admins')
  .use(middleware.auth({ guards: ['api'] }))

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
