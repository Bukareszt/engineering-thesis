import { expect } from 'chai';
import { idGenerator } from '../../src/adapters/idGenerator';
import { inMemoryTriggersRepository } from '../../src/adapters/inMemoryTriggersRepository';
import { User } from '../../src/domains/users/models/User';
import { Workflow } from '../../src/domains/workflows/models/Workflow';
import { WorkflowNode } from '../../src/domains/workflows/models/WorkflowNode';
import { triggersModule } from '../../src/domains/workflows/subdomains/triggers/TriggersModule';
describe('Triggers module', () => {
  describe('Add trigger', () => {
    it('should add trigger', async () => {
      const repo = inMemoryTriggersRepository();
      const executeNode = () => Promise.resolve();

      const getAllWorkflows = (user: User): Promise<Workflow[]> =>
        Promise.resolve([]);
      const module = triggersModule({
        idGenerator,
        executeNode,
        getAllWorkflows,
        repository: repo
      });
      const user = {
        id: 'test',
        username: 'test',
        password: 'test'
      };

      const result = await module.addTrigger(
        {
          name: 'name',
          description: 'description'
        },
        user
      );
      const resultTrigger = await repo.get(result);
      expect(result).to.be.not.undefined;
      expect(resultTrigger?.name).to.be.eql('name');
      expect(resultTrigger?.description).to.be.eql('description');
    });
  });

  describe('Get triggers', () => {
    it('should get triggers', async () => {
      const repo = inMemoryTriggersRepository();
      const executeNode = () => Promise.resolve();

      const getAllWorkflows = (user: User): Promise<Workflow[]> =>
        Promise.resolve([]);
      const module = triggersModule({
        idGenerator,
        executeNode,
        getAllWorkflows,
        repository: repo
      });
      const user = {
        id: 'test',
        username: 'test',
        password: 'test'
      };

      const result = await module.addTrigger(
        {
          name: 'name',
          description: 'description'
        },
        user
      );
      const resultTrigger = await repo.get(result);
      expect(result).to.be.not.undefined;
      expect(resultTrigger?.name).to.be.eql('name');
      expect(resultTrigger?.description).to.be.eql('description');
    });
  });

  describe('Remove trigger', () => {
    it('should remove trigger', async () => {
      const repo = inMemoryTriggersRepository();
      const executeNode = () => Promise.resolve();

      const getAllWorkflows = (user: User): Promise<Workflow[]> =>
        Promise.resolve([]);
      const module = triggersModule({
        idGenerator,
        executeNode,
        getAllWorkflows,
        repository: repo
      });
      const user = {
        id: 'test',
        username: 'test',
        password: 'test'
      };

      const result = await module.addTrigger(
        {
          name: 'name',
          description: 'description'
        },
        user
      );
      const resultTrigger = await repo.get(result);
      expect(result).to.be.not.undefined;
      expect(resultTrigger?.name).to.be.eql('name');
      expect(resultTrigger?.description).to.be.eql('description');
    });

    it('should throw if trigger is used by workflow', async () => {
      const repo = inMemoryTriggersRepository();
      const user = {
        id: 'test',
        username: 'test',
        password: 'test'
      };
      const executeNode = () => Promise.resolve();

      const workflow = Workflow('test', 'test', user.id);
      const getAllWorkflows = () => {
        return Promise.resolve([workflow]);
      };
      const module = triggersModule({
        idGenerator,
        executeNode,
        getAllWorkflows,
        repository: repo
      });
      const result = await module.addTrigger(
        {
          name: 'name',
          description: 'description'
        },
        user
      );
      const resultTrigger = await repo.get(result);
      workflow.addEdge(
        {
          id: '1223',
          action: resultTrigger!,
          viewProps: {
            x: 0,
            y: 0
          },
          workflowId: workflow.id
        },
        {
          id: '14',
          action: {
            id: '14',
            name: 'name',
            description: 'description',
            address: 'http://example.com',
            userId: user.id
          },
          viewProps: {
            x: 0,
            y: 0
          },
          workflowId: workflow.id
        }
      );

      try {
        await module.removeTrigger(result, user);
        expect.fail('Should throw');
      } catch (e: any) {
        expect(e.message).to.be.eql(
          `Trigger with id ${resultTrigger?.id} is used by workflows test`
        );
      }
    });
  });

  describe('Trigger workflow', () => {
    it('should trigger all connected workflows', async () => {
      const repo = inMemoryTriggersRepository();
      const triggeredNodes: WorkflowNode[] = [];
      const executeNode = (node: WorkflowNode) => {
        triggeredNodes.push(node);
        return Promise.resolve();
      };

      const workflow = Workflow('test', 'test', 'test');
      const secondWorkflow = Workflow('test', 'test2', 'test');
      const getAllWorkflows = () => {
        return Promise.resolve([workflow, secondWorkflow]);
      };
      const module = triggersModule({
        idGenerator,
        executeNode,
        getAllWorkflows,
        repository: repo
      });
      const user = {
        id: 'test',
        username: 'test',
        password: 'test'
      };
      const result = await module.addTrigger(
        {
          name: 'name',
          description: 'description'
        },
        user
      );
      const resultTrigger = await repo.get(result);
      workflow.addEdge(
        {
          id: '1223',
          action: resultTrigger!,
          viewProps: {
            x: 0,
            y: 0
          },
          workflowId: workflow.id
        },
        {
          id: '14',
          action: {
            id: '14',
            name: 'name',
            description: 'description',
            address: 'http://example.com',
            userId: 'test'
          },
          viewProps: {
            x: 0,
            y: 0
          },
          workflowId: workflow.id
        }
      );

      secondWorkflow.addEdge(
        {
          id: '1223',
          action: resultTrigger!,
          viewProps: {
            x: 0,
            y: 0
          },
          workflowId: secondWorkflow.id
        },
        {
          id: '14',
          action: {
            id: '14',
            name: 'name',
            description: 'description',
            address: 'http://example.com',
            userId: 'test'
          },
          viewProps: {
            x: 0,
            y: 0
          },
          workflowId: secondWorkflow.id
        }
      );

      await module.triggerWorkflow(resultTrigger!.id, user);

      expect(triggeredNodes).to.be.eql([
        {
          id: '14',
          action: {
            id: '14',
            name: 'name',
            description: 'description',
            address: 'http://example.com',
            userId: 'test'
          },
          viewProps: {
            x: 0,
            y: 0
          },
          workflowId: workflow.id
        },
        {
          id: '14',
          action: {
            id: '14',
            name: 'name',
            description: 'description',
            address: 'http://example.com',
            userId: 'test'
          },
          viewProps: {
            x: 0,
            y: 0
          },
          workflowId: secondWorkflow.id
        }
      ]);
    });
  });

  describe('Get triggers', () => {
    it('should get triggers', async () => {
      const repo = inMemoryTriggersRepository();
      const executeNode = () => Promise.resolve();

      const getAllWorkflows = (user: User): Promise<Workflow[]> =>
        Promise.resolve([]);
      const module = triggersModule({
        idGenerator,
        executeNode,
        getAllWorkflows,
        repository: repo
      });
      const user = {
        id: 'test',
        username: 'test',
        password: 'test'
      };

      await module.addTrigger(
        {
          name: 'name',
          description: 'description'
        },
        user
      );
      const result = await repo.getAll();

      expect(result.length).to.be.eql(1);
      expect(result[0].name).to.be.eql('name');
      expect(result[0].description).to.be.eql('description');
    });
  });
});
