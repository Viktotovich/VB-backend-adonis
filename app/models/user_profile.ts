import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class UserProfile extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare ownerId: number

  @column()
  declare profileStatus: number

  @column()
  declare bio: string

  @column()
  declare linkedinUrl: string

  @column()
  declare instagramUrl: string

  @column()
  declare additionalUrl: string

  @column()
  declare additionalUrlName: string

  @column()
  declare mobileNumber: string | number

  @column()
  declare profileTitle: string

  @column()
  declare color: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
