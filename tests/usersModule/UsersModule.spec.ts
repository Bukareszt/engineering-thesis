import { expect } from 'chai';
import { inMemoryUsersRepository } from '../../src/adapters/InMemoryUsersRepository';
import { idGenerator } from '../../src/adapters/idGenerator';
import { usersModule } from '../../src/domains/users/usersModule';

describe('Users module', () => {
  describe('create user', () => {
    it('should save user', async () => {
      const repo = inMemoryUsersRepository();
      const module = usersModule({
        idGenerator,
        userRepository: repo
      });

      await module.createUser('dawid', 'dawid');
      const result = await repo.getByUsername('dawid');
      expect(result).to.be.not.undefined;
    });
  });

  describe('verifyPassword', () => {
    it('should return true on proper password', async () => {
      const repo = inMemoryUsersRepository();
      const module = usersModule({
        idGenerator,
        userRepository: repo
      });

      await module.createUser('dawid', 'dawid');
      const result = await module.verifyPassword('dawid', 'dawid');
      expect(result).to.be.true;
    });

    it('should return false on invalid password', async () => {
      const repo = inMemoryUsersRepository();
      const module = usersModule({
        idGenerator,
        userRepository: repo
      });

      await module.createUser('dawid', 'dawid');
      const result = await module.verifyPassword('dawid', 'dwa');
      expect(result).to.be.false;
    });

    it('should throw if there is no user with given username', async () => {
      const repo = inMemoryUsersRepository();
      const module = usersModule({
        idGenerator,
        userRepository: repo
      });
      try {
        await module.verifyPassword('dawid', 'dwa');
        throw new Error('invalid msg');
      } catch (e: any) {
        expect(e.message).to.be.eql('User not found');
      }
    });
  });
});
