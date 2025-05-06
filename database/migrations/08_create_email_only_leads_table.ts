import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'email_only_leads'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('email').notNullable()
      table.boolean('has_website').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
