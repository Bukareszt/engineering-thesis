import { expect } from 'chai';
import { idGenerator } from '../../src/adapters/idGenerator';
import { inMemoryExecutableActionsRepository } from '../../src/adapters/inMemoryExecutableActionsRepository';
import { Workflow } from '../../src/domains/workflows/models/Workflow';
import { ActionsExecutor } from '../../src/domains/workflows/ports/ActionsExecutor';
import {
  executableActionsModule,
  ExecutableActionsModule
} from '../../src/domains/workflows/subdomains/executableActions/ExecutableActionsModule';
import { ExecutableActionsRepository } from '../../src/domains/workflows/subdomains/executableActions/ports/ExecutableActionsRepository';

describe('ExecutableActions module', () => {
  let module: ExecutableActionsModule;
  let repository: ExecutableActionsRepository;
  let actionsExecutor: ActionsExecutor = () => {
    return Promise.resolve();
  };
  let getWorkflows: () => Promise<Workflow[]> = () => {
    return Promise.resolve([]);
  };
  beforeEach(() => {
    repository = inMemoryExecutableActionsRepository();
    module = executableActionsModule({
      idGenerator,
      repository,
      actionsExecutor,
      getWorkflows
    });
  });

  describe('registerExecutableAction', () => {
    it('should register a new action', async () => {
      const testUser = {
        id: 'test',
        username: 'test',
        password: 'test'
      };
      await module.registerExecutableAction(
        {
          name: 'name',
          description: 'description',
          address: 'http://example.com'
        },
        testUser
      );

      const actions = await module.getAllActions(testUser);
      expect(actions.length).to.be.eql(1);
      expect(actions[0].name).to.be.eql('name');
      expect(actions[0].description).to.be.eql('description');
      expect(actions[0].address).to.eql('http://example.com');
    });

    it('should call actionsExecutor', async () => {
      const testUser = {
        id: 'test',
        username: 'test',
        password: 'test'
      };
      let called = false;
      actionsExecutor = () => {
        called = true;
        return Promise.resolve();
      };
      module = executableActionsModule({
        idGenerator,
        repository,
        actionsExecutor,
        getWorkflows
      });
      await module.registerExecutableAction(
        {
          name: 'name',
          description: 'description',
          address: 'http://example.com'
        },
        testUser
      );
      expect(called).to.be.true;
    });
  });

  describe('removeExecutableAction', () => {
    it('should remove an action', async () => {
      const testUser = {
        id: 'test',
        username: 'test',
        password: 'test'
      };
      const id = await module.registerExecutableAction(
        {
          name: 'name',
          description: 'description',
          address: 'http://example.com'
        },
        testUser
      );
      await module.removeExecutableAction(id, testUser);
      const actions = await module.getAllActions(testUser);
      expect(actions.length).to.be.eql(0);
    });

    it('should throw if action is used by workflow', async () => {
      const testUser = {
        id: 'test',
        username: 'test',
        password: 'test'
      };
      const workflow = Workflow('test', 'test', testUser.id);
      getWorkflows = () => {
        return Promise.resolve([workflow]);
      };
      const module = executableActionsModule({
        idGenerator,
        repository,
        actionsExecutor,
        getWorkflows
      });

      const id = await module.registerExecutableAction(
        {
          name: 'name',
          description: 'description',
          address: 'http://example.com'
        },
        testUser
      );

      const actions = await module.getAllActions(testUser);
      workflow.addEdge(
        {
          id: '1223',
          action: actions[0],
          viewProps: {
            x: 0,
            y: 0
          },
          workflowId: workflow.id
        },
        {
          id: '14',
          action: actions[0],
          viewProps: {
            x: 0,
            y: 0
          },
          workflowId: workflow.id
        }
      );

      try {
        await module.removeExecutableAction(id, testUser);
        throw new Error('Should not throw');
      } catch (e: any) {
        expect(e.message).to.be.eql(
          'Action with id ' + id + ' is used by workflows ' + workflow.id
        );
      }
    });
  });

  describe('getAllActions', () => {
    it('should return all actions related to user', async () => {
      const testUser = {
        id: 'test',
        username: 'test',
        password: 'test'
      };
      await module.registerExecutableAction(
        {
          name: 'name',
          description: 'description',
          address: 'http://example.com'
        },
        testUser
      );
      const actions = await module.getAllActions(testUser);
      expect(actions.length).to.be.eql(1);
    });
  });

  describe('getAction', () => {
    it('should return an action', async () => {
      const testUser = {
        id: 'test',
        username: 'test',
        password: 'test'
      };
      const id = await module.registerExecutableAction(
        {
          name: 'name',
          description: 'description',
          address: 'http://example.com'
        },
        testUser
      );
      const action = await module.getExecutableAction(id);
      expect(action?.id).to.be.eql(id);
    });
  });
});
