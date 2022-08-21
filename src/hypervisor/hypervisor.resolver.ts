import { ScrapTask, TaskState } from '@auto/graphql'
import { Logger, UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql'
import { Scrapper } from '@prisma/client'
import { randomUUID } from 'crypto'
import { PubSub } from 'graphql-subscriptions'
import { DateTime } from 'luxon'
import {
  GqlScrapperAuthGuard,
  CurrentScrapper,
} from 'src/gql-scrapper-token.guard'
import { ScrapperTriggers } from './hypervisor.triggers'

@Resolver()
export class HypervisorResolver {
  private readonly logger = new Logger(HypervisorResolver.name)
  private readonly pubsub = new PubSub()

  @UseGuards(GqlScrapperAuthGuard)
  @Subscription()
  public tasksDispositions(@CurrentScrapper() scrapper: Scrapper) {
    this.logger.verbose(
      `Scrapper "${
        scrapper.alias ?? scrapper.id
      }" is subscribing to tasks dispositions!`,
    )
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
