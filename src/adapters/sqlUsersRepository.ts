import { Kysely } from 'kysely';
import { DB } from '../db/dbTypes';
import { User } from '../domains/users/models/User';
import { UserRepository } from '../domains/users/ports/UserRepository';

export const sqlUsersRepository = (db: Kysely<DB>): UserRepository => {
  const getByUsername = async (username: string): Promise<User | undefined> => {
    const result = await db
      .selectFrom('users')
      .where('username', '=', username)
      .select(['id', 'username', 'password'])
      .executeTakeFirst();
    if (!result) return undefined;

    return {
      id: result.id,
      username: result.username,
      password: result.password
    };
  };

  const save = async (user: User) => {
    await db
      .insertInto('users')
      .values({
        id: user.id,
        username: user.username,
        password: user.password
      })
      .execute();
  };

  return { getByUsername, save };
};
