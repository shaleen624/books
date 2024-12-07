import { Patch } from 'backend/database/types';

const patch: Patch = {
  name: 'Add Customer Prices Tables',
  version: '0.24.2',
  patch: {
    async execute(db) {
      await db.db?.knex?.schema.createTable('CustomerItemPrice', (table) => {
        table.string('name').primary();
        table.string('customer').references('name').inTable('Party').onDelete('CASCADE');
        table.string('item').references('name').inTable('Item').onDelete('CASCADE');
        table.decimal('rate', 12, 2);
        table.string('createdBy');
        table.string('modifiedBy');
        table.timestamp('created').defaultTo(db.db?.knex?.fn.now());
        table.timestamp('modified').defaultTo(db.db?.knex?.fn.now());
        table.unique(['customer', 'item']);
      });

      await db.db?.knex?.schema.createTable('CustomerItemPriceHistory', (table) => {
        table.string('name').primary();
        table.string('customer').references('name').inTable('Party').onDelete('CASCADE');
        table.string('item').references('name').inTable('Item').onDelete('CASCADE');
        table.decimal('oldRate', 12, 2);
        table.decimal('newRate', 12, 2);
        table.string('modifiedBy');
        table.timestamp('modified').defaultTo(db.db?.knex?.fn.now());
        table.string('source').defaultTo('manual');
      });

      await db.db?.knex?.schema.alterTable('SystemSettings', (table) => {
        table.boolean('showPriceComparison').defaultTo(true);
      });
    }
  }
};

export default patch; 