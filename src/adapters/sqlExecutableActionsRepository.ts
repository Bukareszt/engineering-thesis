import { Kysely } from 'kysely';
import { DB, ExecutableActions } from '../db/dbTypes';
import { ExecutableAction } from '../domains/workflows/subdomains/executableActions/ExecutableAction';
import { ExecutableActionsRepository } from '../domains/workflows/subdomains/executableActions/ports/ExecutableActionsRepository';

export const sqlExecutableActionsRepository = (
  db: Kysely<DB>
): ExecutableActionsRepository => {
  const applyAction = async (action: ExecutableAction) => {
    await db
      .insertInto('executable_actions')
      .values({ ...action, user_id: action.userId })
      .execute();
  };

  const get = async (id: string) => {
    const result = await db
      .selectFrom('executable_actions')
      .where('id', '=', id)
      .select(['id', 'name', 'address', 'description', 'user_id'])
      .executeTakeFirst();
    return result ? mapRowToExecutableAction(result) : undefined;
  };

  const getAll = async (userId: string) => {
    const result = await db
      .selectFrom('executable_actions')
      .selectAll()
      .where('user_id', '=', userId)
      .execute();
    return result.map(mapRowToExecutableAction);
  };

  const mapRowToExecutableAction = (
    row: ExecutableActions
  ): ExecutableAction => {
    return {
      id: row.id,
      name: row.name,
      address: row.address,
      description: row.description,
      userId: row.user_id
    };
  };

  const remove = async (id: string) => {
    await db.deleteFrom('executable_actions').where('id', '=', id).execute();
  };

  return {
    applyAction,
    get,
    getAll,
    remove
  };
};
