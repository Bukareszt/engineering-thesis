export type Trigger = {
  name: string;
  id: string;
  description: string;
};

export type TriggerDTO = Omit<Trigger, 'id'>;
