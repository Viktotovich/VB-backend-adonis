import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    fullname: vine.string().maxLength(100).optional(),
    email: vine
      .string()
      .email()
      .normalizeEmail()
      .unique(async (db, value, _field) => {
        const result = await db.from('users').select('id').where('email', value)
        return result.length ? false : true
      }),
    password: vine.string().minLength(8).maxLength(70),
    username: vine
      .string()
      .alphaNumeric()
      .toLowerCase() //so vova2k VOVA2K VoVa2K would be the same user
      .minLength(3)
      .maxLength(70)
      .unique(async (db, value, _field) => {
        const result = await db.from('users').select('id').where('username', value)
        return result.length ? false : true
      }),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password: vine.string(),
  })
)
