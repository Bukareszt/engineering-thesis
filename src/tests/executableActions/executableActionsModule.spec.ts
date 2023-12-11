import { expect } from 'chai';
import { WorkflowNode } from '../../domains/workflows/models/WorkflowNode';
import { executableActionsModule } from '../../domains/workflows/subdomains/executableActions/ExecutableActionsModule';
import { inMemoryExecutableActionsRepository } from '../../domains/workflows/subdomains/executableActions/ExecutableActionsRepository';

describe('ExecutableActionsModule', () => {
  const repository = inMemoryExecutableActionsRepository();
  const module = executableActionsModule({
    actionsExecutor: async (
      executionId: string,
      workflowNode: WorkflowNode
    ) => {},
    idGenerator: () => 'id',
    repository
  });

  beforeEach(() => {
    repository.clear();
  });

  it('should register an executable action', async () => {
    const resultID = await module.registerExecutableAction({
      address: 'address',
      name: 'name',
      description: 'description'
    });

    const result = await module.getExecutableAction(resultID);
    expect(result).to.eql({
      address: 'address',
      name: 'name',
      description: 'description',
      id: 'id'
    });
  });

  it('should not register action on throw of actionExecutor', async () => {
    const module = executableActionsModule({
      actionsExecutor: async (
        executionId: string,
        workflowNode: WorkflowNode
      ) => {
        throw new Error('error');
      },
      idGenerator: () => 'id',
      repository
    });
    try {
      await module.registerExecutableAction({
        address: 'address',
        name: 'name',
        description: 'description'
      });
    } catch (error) {
      expect(error).to.be.instanceOf(Error);
    }

    const result = await module.getAllActions();
    expect(result).to.be.empty;
  });

  it('should get an executable action', async () => {
    await repository.applyAction({
      address: 'address',
      name: 'name',
      description: 'description',
      id: 'id'
    });

    const result = await module.getExecutableAction('id');
    expect(result).to.eql({
      address: 'address',
      name: 'name',
      description: 'description',
      id: 'id'
    });
  });

  it('should get all executable actions', async () => {
    await repository.applyAction({
      address: 'address',
      name: 'name',
      description: 'description',
      id: 'id'
    });
    await repository.applyAction({
      address: 'address2',
      name: 'name2',
      description: 'description2',
      id: 'id2'
    });

    const result = await module.getAllActions();
    expect(result).to.eql([
      {
        address: 'address',
        name: 'name',
        description: 'description',
        id: 'id'
      },
      {
        address: 'address2',
        name: 'name2',
        description: 'description2',
        id: 'id2'
      }
    ]);
  });
});
