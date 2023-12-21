export type ExecutableAction = {
  readonly address: string;
  readonly name: string;
  readonly id: string;
  readonly description: string;
  readonly userId: string;
};

export const ExecutableAction = ({
  address,
  name,
  id,
  description,
  userId
}: ExecutableAction): ExecutableAction => {
  return {
    address,
    name,
    id,
    description,
    userId
  };
};
