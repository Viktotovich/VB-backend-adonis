import { BaseSchema } from '@adonisjs/lucid/schema'
import UserRoles from '../../app/enums/user_roles.js'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('full_name').nullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()

      // Role check + username visible to others
      table.string('username').notNullable().unique()
      table.integer('role_id').unsigned().defaultTo(UserRoles.USER)

      //Blog and posts related info
      table.string('avatar_url').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
