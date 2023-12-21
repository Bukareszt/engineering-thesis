import { IdGenerator } from '../../adapters/idGenerator';
import { CreateUser, createUser } from './commands/CreateUser';
import { VerifyPassword, verifyPassword } from './commands/VerifyPassword';
import { User } from './models/User';
import { UserRepository } from './ports/UserRepository';

export type UsersModule = {
  createUser: CreateUser;
  verifyPassword: VerifyPassword;
  getByUsername: (username: string) => Promise<User | undefined>;
};

export const usersModule = ({
  idGenerator,
  userRepository
}: {
  idGenerator: IdGenerator;
  userRepository: UserRepository;
}): UsersModule => {
  const createUserCommand = createUser({ idGenerator, userRepository });
  const verifyPasswordCommand = verifyPassword({ userRepository });

  const getUser = (username: string) => userRepository.getByUsername(username);

  return {
    createUser: createUserCommand,
    verifyPassword: verifyPasswordCommand,
    getByUsername: getUser
  };
};
