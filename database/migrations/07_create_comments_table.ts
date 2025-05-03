import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'comments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.json('content').notNullable()

      //References
      table.integer('author_id').unsigned().references('users.id').notNullable().onDelete('CASCADE')
      table.integer('blog_id').unsigned().references('blogs.id').notNullable().onDelete('CASCADE')
      table.string('image_url').nullable() // if later on users can images

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
