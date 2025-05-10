import Post from '#models/post'
import PostLike from '#models/post_like'
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

  async like({ request, response, auth }: HttpContext) {
    const { postId } = request.params()
    const userId = auth.user?.$original.id

    const existingLike = await PostLike.query()
      .where('postId', postId)
      .andWhere('userId', userId)
      .first()

    if (existingLike) {
      //If exists, un-do the like
      await existingLike.delete()
      return response.status(202).json({ message: 'success' })
    } else {
      //If doesnt exist, like
      const newLike = await PostLike.create({ postId, userId })
      return response.status(202).json({ message: 'success', likeId: newLike.id })
    }
  }
}
