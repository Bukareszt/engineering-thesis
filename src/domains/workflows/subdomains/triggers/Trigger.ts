export type Trigger = {
  name: string;
  type: 'webhook' | 'timer';
  id: string;
  workflowId: string;
  nodeId: string;
};

export type TriggerDTO = Omit<Trigger, 'id'>;
