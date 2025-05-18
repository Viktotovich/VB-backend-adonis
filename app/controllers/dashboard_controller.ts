import Post from '#models/post'
import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  async show({ request, response, auth }: HttpContext) {
    const user = auth.user

    if (!user) return response.unauthorized()

    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    //include likes and comments
    const posts = await Post.query()
      .preload('author')
      .preload('likes')
      .preload('replies')
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)
    await user.load('likes')
    const userLikes = user.likes.map((like) => like.postId)

    return response.json({ posts, userLikes })
  }
}
