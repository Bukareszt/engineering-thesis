export type Trigger = {
  name: string;
  id: string;
  description: string;
  userId: string;
};

export const Trigger = ({
  name,
  id,
  description,
  userId
}: Trigger): Trigger => {
  return {
    name,
    id,
    description,
    userId
  };
};

export type TriggerDTO = Omit<Trigger, 'userId' | 'id'>;
