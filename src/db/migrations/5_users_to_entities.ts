import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('executable_actions')
    .addColumn('user_id', 'uuid', (col) => col.notNull().references('users.id'))
    .execute();
  await db.schema
    .alterTable('workflows')
    .addColumn('user_id', 'uuid', (col) => col.notNull().references('users.id'))
    .execute();
  await db.schema
    .alterTable('triggers')
    .addColumn('user_id', 'uuid', (col) => col.notNull().references('users.id'))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('executable_actions')
    .dropColumn('user_id')
    .execute();
  await db.schema.alterTable('workflows').dropColumn('user_id').execute();
  await db.schema.alterTable('triggers').dropColumn('user_id').execute();
}
