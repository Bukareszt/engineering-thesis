import { expect } from 'chai';
import { Workflow } from '../../domains/workflows/models/Workflow';
import { WorkflowNode } from '../../domains/workflows/models/WorkflowNode';
import { triggersModule } from '../../domains/workflows/subdomains/triggers/TriggersModule';

import { inMemoryTriggersRepository } from '../../adapters/inMemoryTriggersRepository';

describe('TriggersModule', () => {
  const repository = inMemoryTriggersRepository();
  const module = triggersModule({
    idGenerator: () => 'id',
    executeNode: async (node: WorkflowNode) => {},
    getAllWorkflows: async () => [],
    repository
  });

  beforeEach(() => {
    repository.clear();
  });

  it('should register a webhook trigger', async () => {
    const resultID = await module.addTrigger({
      name: 'name',
      description: 'description',
      type: 'webhook'
    });

    const result = await module.getTrigger(resultID);
    expect(result).to.eql({
      id: resultID,
      name: 'name',
      description: 'description',
      type: 'webhook'
    });
  });

  it('should register a timer trigger', async () => {
    const resultID = await module.addTrigger({
      name: 'name',
      description: '* * * * *',
      type: 'timer'
    });

    const result = await module.getTrigger(resultID);
    expect(result).to.eql({
      id: resultID,
      name: 'name',
      description: '* * * * *',
      type: 'timer'
    });
  });

  it('should get all triggers', async () => {
    await repository.save({
      id: 'id',
      name: 'name',
      description: 'description',
      type: 'webhook'
    });

    await repository.save({
      id: 'id2',
      name: 'name',
      description: '* * * * *',
      type: 'timer'
    });

    const result = await module.getTriggers();
    expect(result).to.eql([
      {
        id: 'id',
        name: 'name',
        description: 'description',
        type: 'webhook'
      },
      {
        id: 'id2',
        name: 'name',
        description: '* * * * *',
        type: 'timer'
      }
    ]);
  });

  it('should get a trigger', async () => {
    await repository.save({
      id: 'id',
      name: 'name',
      description: 'description',
      type: 'webhook'
    });

    const result = await module.getTrigger('id');
    expect(result).to.eql({
      id: 'id',
      name: 'name',
      description: 'description',
      type: 'webhook'
    });
  });

  it('should trigger workflow on proper triggerId', async () => {
    const workflow = Workflow('name', 'description');

    const secondWorkflow = Workflow('name2', 'description2');

    workflow.addEdge(
      {
        id: '1234',
        action: {
          name: 'test',
          type: 'timer',
          id: 'id',
          description: 'de'
        },
        workflowId: 'workflowId'
      },
      {
        id: '12345',
        action: {
          address: 'dwa',
          name: 'trzy',
          id: 'test',
          description: 'test'
        },
        workflowId: 'workflowId'
      }
    );
    secondWorkflow.addEdge(
      {
        id: '1234',
        action: {
          name: 'test',
          type: 'timer',
          id: 'id',
          description: 'de'
        },
        workflowId: 'workflowId2'
      },
      {
        id: '12345',
        action: {
          address: 'dwa',
          name: 'trzy',
          id: 'test',
          description: 'test'
        },
        workflowId: 'workflowId2'
      }
    );

    const executedWorkflows: string[] = [];
    const module = triggersModule({
      idGenerator: () => 'id',
      executeNode: async (node: WorkflowNode) => {
        executedWorkflows.push(node.workflowId);
      },
      getAllWorkflows: async () => [workflow, secondWorkflow],
      repository
    });
    await module.addTrigger({
      name: 'name',
      description: '* * * * *',
      type: 'timer'
    });

    await module.triggerWorkflow('id');
    expect(executedWorkflows).to.eql(['workflowId', 'workflowId2']);
  });
});
