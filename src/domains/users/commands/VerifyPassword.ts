import bcrypt from 'bcrypt';
import { UserRepository } from '../ports/UserRepository';

export type VerifyPassword = (
  username: string,
  password: string
) => Promise<boolean>;
export const verifyPassword =
  ({ userRepository }: { userRepository: UserRepository }): VerifyPassword =>
  async (username: string, password: string): Promise<boolean> => {
    const user = await userRepository.getByUsername(username);
    if (!user) {
      throw new Error('User not found');
    }

    return bcrypt.compare(password, user.password);
  };
