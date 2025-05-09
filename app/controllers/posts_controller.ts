import Post from '#models/post'
import type { HttpContext } from '@adonisjs/core/http'

export default class PostsController {
  async store({ request, response, auth }: HttpContext) {
    //1. Validate the data
    const { title, content } = request.body()
    //2. Find the user
    const userId = auth.user?.$original.id

    //3. Attach the post to the user, and create the post
    const post = await Post.create({
      title,
      content,
      authorId: userId,
    })

    //4. Return response
    return response.json({ allowRedirect: true, post })
  }
}
