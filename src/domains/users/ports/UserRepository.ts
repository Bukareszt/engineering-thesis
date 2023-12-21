import { User } from '../models/User';

export type UserRepository = {
  getByUsername: (username: string) => Promise<User | undefined>;
  save: (user: User) => Promise<void>;
};
