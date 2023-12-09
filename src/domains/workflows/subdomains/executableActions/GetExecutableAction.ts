import {
  ExecutableAction,
  ExecutableActionsRepository
} from './ExecutableActionsRepository';

export type GetExecutableAction = (
  id: string
) => Promise<ExecutableAction | undefined>;
export const getExecutableActions =
  (
    executableActionsRepository: ExecutableActionsRepository
  ): GetExecutableAction =>
  async (id: string) => {
    const executableActions = await executableActionsRepository.get(id);
    return executableActions;
  };
