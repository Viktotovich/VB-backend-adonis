import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'post_likes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      //References
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE').notNullable()
      table.integer('post_id').unsigned().references('posts.id').onDelete('CASCADE').notNullable()

      //Duplication prevention
      table.unique(['user_id', 'post_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
