import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'post_replies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('content', 400).notNullable()

      //references
      table.integer('post_id').unsigned().references('posts.id').notNullable().onDelete('CASCADE')
      table.integer('author_id').unsigned().references('users.id').notNullable().onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
