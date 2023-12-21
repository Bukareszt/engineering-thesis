import bcrypt from 'bcrypt';
import { IdGenerator } from '../../../adapters/idGenerator';
import { UserRepository } from '../ports/UserRepository';

export type CreateUser = (username: string, password: string) => Promise<void>;
export const createUser =
  ({
    userRepository,
    idGenerator
  }: {
    userRepository: UserRepository;
    idGenerator: IdGenerator;
  }): CreateUser =>
  async (username: string, password: string) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: idGenerator(),
      username,
      password: hashedPassword
    };

    await userRepository.save(user);
  };
