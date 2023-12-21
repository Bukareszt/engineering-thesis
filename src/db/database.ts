import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { DB } from './dbTypes';

//postgres://postgres:postgres@localhost:5000/engine

export const createDb = (connectionString: string) =>
  new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString
      })
    })
  });
