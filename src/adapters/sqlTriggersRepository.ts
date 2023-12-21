import { Kysely } from 'kysely';
import { DB, Triggers } from '../db/dbTypes';
import { Trigger } from '../domains/workflows/subdomains/triggers/Trigger';
import { TriggersRepository } from '../domains/workflows/subdomains/triggers/ports/TriggersRepository';

export const sqlTriggersRepository = (db: Kysely<DB>): TriggersRepository => {
  const save = async (trigger: Trigger) => {
    await db
      .insertInto('triggers')
      .values({
        ...trigger,
        user_id: trigger.userId
      })
      .execute();
  };

  const get = async (id: string) => {
    const result = await db
      .selectFrom('triggers')
      .where('id', '=', id)
      .select(['id', 'name', 'description', 'user_id'])
      .executeTakeFirst();
    return result ? mapToDomain(result) : undefined;
  };

  const getAll = async (userId: string) => {
    const result = await db
      .selectFrom('triggers')
      .selectAll()
      .where('user_id', '=', userId)
      .execute();

    return result.map(mapToDomain);
  };

  const remove = async (id: string) => {
    await db.deleteFrom('triggers').where('id', '=', id).execute();
  };

  const mapToDomain = (trigger: Triggers) => {
    return Trigger({
      id: trigger.id,
      name: trigger.name,
      description: trigger.description,
      userId: trigger.user_id
    });
  };

  return {
    save,
    get,
    getAll,
    remove
  };
};
