import { BaseSchema } from '@adonisjs/lucid/schema'
import BlogStatus from '../../app/enums/blog_status.js'

export default class extends BaseSchema {
  protected tableName = 'blogs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()

      //Blog title, content, category, and slug
      table.string('title').notNullable().unique()
      table.json('blog_build').notNullable()
      table.string('slug').notNullable().unique()

      //References
      table.integer('author_id').unsigned().references('user.id').notNullable().onDelete('CASCADE')
      table.json('author_socials').nullable()

      // TODO: Must be a pivot table, as blogs probably should have many cats
      //table.integer('category_id').references('categories.id').notNullable()

      //Enum
      table.integer('approval').defaultTo(BlogStatus.DRAFT)

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
