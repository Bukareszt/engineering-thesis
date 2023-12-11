import {
  ExecutableAction,
  ExecutableActionsRepository
} from './ExecutableActionsRepository';

export type GetAllExecutableActions = () => Promise<ExecutableAction[]>;
export const getAllExecutableActions =
  (
    executableActionsRepository: ExecutableActionsRepository
  ): GetAllExecutableActions =>
  async () => {
    const executableActions = await executableActionsRepository.getAll();
    return executableActions;
  };
