import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Role from './role.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Comment from './comment.js'
import Blog from './blog.js'
import Post from './post.js'
import PostLike from './post_like.js'
import PostReply from './post_reply.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullname: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare username: string

  @column()
  declare roleId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Role)
  declare role: BelongsTo<typeof Role>

  @hasMany(() => Comment)
  declare comments: HasMany<typeof Comment>

  @hasMany(() => Blog)
  declare blogs: HasMany<typeof Blog>

  @hasMany(() => Post)
  declare posts: HasMany<typeof Post>

  @hasMany(() => PostLike)
  declare likes: HasMany<typeof PostLike>

  @hasMany(() => PostReply)
  declare replies: HasMany<typeof PostReply>

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30 days', // normally, never expiring
    prefix: 'oat_', //default
    table: 'auth_access_tokens', //default
    type: 'auth_token', //default
    tokenSecretLength: 42, // normally 40
  })
}
