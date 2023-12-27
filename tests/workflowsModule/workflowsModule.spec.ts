import { expect } from 'chai';
import {WorkflowsModule, workflowsModule} from '../../src/domains/workflows/workflowsModule';
import {idGenerator} from "../../src/adapters/idGenerator";
import {inMemoryExecutableActionsRepository} from "../../src/adapters/inMemoryExecutableActionsRepository";
import {inMemoryTriggersRepository} from "../../src/adapters/inMemoryTriggersRepository";
import {inMemoryWorkflowRepository} from "../../src/adapters/inMemoryWorkflowRepository";
import {inMemoryPendingExecutionsRepository} from "../../src/adapters/inMemoryPendingExecutionsRepository";
import {ExecutableActionsModule} from "../../src/domains/workflows/subdomains/executableActions/ExecutableActionsModule";
import {TriggersModule} from "../../src/domains/workflows/subdomains/triggers/TriggersModule";

describe('Workflows module', () => {
    let workflowsMdl: WorkflowsModule
    let actionsMdl: ExecutableActionsModule
    let triggersMdl: TriggersModule
    const user = {
        id: 'test',
        username: 'test',
        password: 'test'
    };


    beforeEach( () => {
      const result = workflowsModule({
            idGenerator,
            workflowsRepository: inMemoryWorkflowRepository(),
            triggersRepository: inMemoryTriggersRepository(),
            executableActionsRepository: inMemoryExecutableActionsRepository(),
            pendingExecutionsRepository: inMemoryPendingExecutionsRepository(),
            actionsExecutor: () => Promise.resolve(),
        });
        workflowsMdl = result.workflowsModule
        actionsMdl = result.executableActionsModule
        triggersMdl = result.triggersModule
    })
    describe('create workflow', () => {
        it('should create workflow', async () => {

            const result = await workflowsMdl.addWorkflow("dwa", [], user)
            const workflow = await workflowsMdl.getWorkflow(result)
            expect(workflow).to.be.not.undefined
            expect(workflow?.name).to.be.eql("dwa")
        });
        it('should throw if workflow has cycle', async () => {
            const actionId = await actionsMdl.registerExecutableAction({
                name: 'name',
                description: 'description',
                address: 'http://example.com',
            }, user)
            try {
                await workflowsMdl.addWorkflow("dwa", [
                    {
                        from: {id: "1", actionId: actionId, viewProps: {x: 0, y: 0}},
                        to: {id: "2", actionId: actionId, viewProps: {x: 0, y: 0}},
                    },
                        {
                        from: {id: "2", actionId: actionId, viewProps: {x: 0, y: 0}},
                        to: {id: "1", actionId: actionId, viewProps: {x: 0, y: 0}},
                        }
                ]
                , user);
            } catch (e: any) {
                expect(e.message).to.be.eql("Workflow must not contain cycles.")
            }
        })
    })

    describe('remove workflow', () => {
        it('should remove workflow', async () => {
            const result = await workflowsMdl.addWorkflow("dwa", [], user)
            await workflowsMdl.removeWorkflow(result)
            const workflow = await workflowsMdl.getWorkflow(result)
            expect(workflow).to.be.undefined
        });
    })

    describe('get workflow', () => {
        it('should get workflow', async () => {
            const result = await workflowsMdl.addWorkflow("dwa", [], user)
            const workflow = await workflowsMdl.getWorkflow(result)
            expect(workflow).to.be.not.undefined
            expect(workflow?.name).to.be.eql("dwa")
        });
    })

    describe('get workflows', () => {
        it('should get workflows', async () => {
            const result = await workflowsMdl.addWorkflow("dwa", [], user)
            const workflows = await workflowsMdl.getAll(user)
            expect(workflows).to.be.not.undefined
            expect(workflows.length).to.be.eql(1)
            expect(workflows[0].name).to.be.eql("dwa")
        });
    })

    describe('edit workflow', () => {
        it('should edit workflow', async () => {
            const result = await workflowsMdl.addWorkflow("dwa", [], user)
            await workflowsMdl.editWorkflow(result, "dwa2",[], user)
            const workflow = await workflowsMdl.getWorkflow(result)
            expect(workflow).to.be.not.undefined
            expect(workflow?.name).to.be.eql("dwa2")
        });
        it('should throw if workflow has cycle', async () => {
            const actionId = await actionsMdl.registerExecutableAction({
                name: 'name',
                description: 'description',
                address: 'http://example.com',
            }, user)
            const workflowId = await workflowsMdl.addWorkflow("dwa", [], user)
            try {
                await workflowsMdl.editWorkflow(workflowId, "dwa2", [
                        {
                            from: {id: "1", actionId: actionId, viewProps: {x: 0, y: 0}},
                            to: {id: "2", actionId: actionId, viewProps: {x: 0, y: 0}},
                        },
                        {
                            from: {id: "2", actionId: actionId, viewProps: {x: 0, y: 0}},
                            to: {id: "1", actionId: actionId, viewProps: {x: 0, y: 0}},
                        }
                    ]
                    , user);
                    expect.fail()
            } catch (e: any) {
                expect(e.message).to.be.eql("Workflow must not contain cycles.")
            }
        })
    })

    describe('finish node execution', () => {
        it('should call next node if exists', async () => {
            const calledNodes: string[] = []
            const result = workflowsModule({
              idGenerator: () => 'test',
              workflowsRepository: inMemoryWorkflowRepository(),
              triggersRepository: inMemoryTriggersRepository(),
              executableActionsRepository:
                inMemoryExecutableActionsRepository(),
              pendingExecutionsRepository:
                inMemoryPendingExecutionsRepository(),
              actionsExecutor: (node) => {
                  calledNodes.push(node)
                return Promise.resolve();
              }
            });
            workflowsMdl = result.workflowsModule
            actionsMdl = result.executableActionsModule
            triggersMdl = result.triggersModule

            const actionId = await actionsMdl.registerExecutableAction({
                name: 'name',
                description: 'description',
                address: 'http://example.com',
            }, user)
            const triggerId = await triggersMdl.addTrigger({
                name: 'name',
                description: 'description'
            }, user)
            const workflowId = await workflowsMdl.addWorkflow("dwa", [{
                from: {id: "1", actionId: triggerId, viewProps: {x: 0, y: 0}},
                to: {id: "2", actionId: actionId, viewProps: {x: 0, y: 0}},
            }], user)

            await triggersMdl.triggerWorkflow(triggerId, user)
            await workflowsMdl.finishNodeExecution("test");

            expect(calledNodes).to.be.eql(["test", "test"])
        })
    })
})
