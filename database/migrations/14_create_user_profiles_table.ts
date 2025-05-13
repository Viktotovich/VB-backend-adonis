import { BaseSchema } from '@adonisjs/lucid/schema'
import ProfileStatus from '../../app/enums/profile_status.js'

export default class extends BaseSchema {
  protected tableName = 'user_profiles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable

      //references
      table.integer('owner_id').unsigned().references('users.id').notNullable().onDelete('CASCADE')

      //Additional profile information
      table.integer('profile_status').notNullable().defaultTo(ProfileStatus.INCOMPLETE)
      table.string('bio', 1000).nullable()

      //URLs
      table.string('linkedin_url', 120).nullable() //120 chars @ updateProfileValidator
      table.string('instagram_url', 120).nullable()
      table.string('additional_url', 120).nullable()
      table.string('additional_url_name', 150).nullable()

      //Contact Information
      table.string('mobile_number', 20).nullable()
      table.string('profile_title', 150).nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
