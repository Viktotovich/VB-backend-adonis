import { BaseSchema } from '@adonisjs/lucid/schema'
import LeadStatuses from '../../app/enums/lead_statuses.js'

export default class extends BaseSchema {
  protected tableName = 'quality_leads'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.boolean('has_website').notNullable()
      table.string('requirements').nullable()
      table.string('email').notNullable()
      table.string('phone_number').nullable()
      table.string('additional_information', 500).nullable()

      //status
      table.integer('lead_status').defaultTo(LeadStatuses.NEW)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
