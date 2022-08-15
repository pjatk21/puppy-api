import { ScrapTask, TaskState } from '@auto/graphql'
import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql'
import { randomUUID } from 'crypto'
import { PubSub } from 'graphql-subscriptions'
import { DateTime } from 'luxon'
import { ScrapperTriggers } from './hypervisor.triggers'

@Resolver()
export class HypervisorResolver {
  private readonly pubsub = new PubSub()
  @Subscription()
  public tasksDispositions(@Args('scraperId') sid: string) {
    return this.pubsub.asyncIterator('scrapTask')
  }

  private get fakeTask() {
    return {
      id: randomUUID(),
      name: 'test',
      state: TaskState.WAITING,
      since: DateTime.now(),
      until: DateTime.now().plus({ months: 3 }),
    }
  }

  @Mutation()
  public async triggerTask(@Args('scraperId') sid: string): Promise<string> {
    console.log('trigger', sid)
    const fakeTask = this.fakeTask
    await this.pubsub.publish('scrapTask', { tasksDispositions: fakeTask })
    return fakeTask.id
  }
}
