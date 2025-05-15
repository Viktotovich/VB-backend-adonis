import vine from '@vinejs/vine'

//TODO: POSTS VALIDATOR
export const newPostValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(5).maxLength(120),
    content: vine.string().minLength(50).maxLength(400),
  })
)
