import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema.createTable('executable_actions')
        .addColumn('id', "uuid", (col) => col.primaryKey())
        .addColumn('name', "text", (col) => col.notNull())
        .addColumn('address', "text", (col) => col.notNull())
        .addColumn('description', "text", (col) => col.notNull())
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
   await db.schema.dropTable('executable_actions').execute()
}