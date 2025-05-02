import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()

      //.unsigned() === no negatives
      //table.integer('post_id').unsigned().references('blogs.id').nullable()

      // We can keep this same, have different categories WITH a pivot table
      // Post_categories that links cat.id with post.id
      // >>This way, cats have no dependencies

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
