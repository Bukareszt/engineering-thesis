import { User } from '../../../../users/models/User';
import { ExecutableAction } from '../ExecutableAction';
import { ExecutableActionsRepository } from '../ports/ExecutableActionsRepository';

export type GetAllExecutableActions = (
  user: User
) => Promise<ExecutableAction[]>;
export const getAllExecutableActions =
  (
    executableActionsRepository: ExecutableActionsRepository
  ): GetAllExecutableActions =>
  async (user: User) => {
    const executableActions = await executableActionsRepository.getAll(user.id);
    return executableActions;
  };
