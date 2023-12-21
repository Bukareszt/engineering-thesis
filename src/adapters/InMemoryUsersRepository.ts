import { User } from '../domains/users/models/User';
import { UserRepository } from '../domains/users/ports/UserRepository';

export const inMemoryUsersRepository = (): UserRepository => {
  const users: Map<string, User> = new Map<string, User>();

  return {
    getByUsername: async (username: string): Promise<User | undefined> => {
      return users.get(username);
    },
    save: async (user: User): Promise<void> => {
      users.set(user.username, user);
    }
  };
};
