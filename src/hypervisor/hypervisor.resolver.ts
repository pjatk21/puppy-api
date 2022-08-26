import { ScrapTask, TaskState } from '@auto/graphql'
import { Logger, UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql'
import { Scraper, User } from '@prisma/client'
import { randomUUID } from 'crypto'
import { PubSub } from 'graphql-subscriptions'
import { DateTime } from 'luxon'
import {
  GqlScraperAuthGuard,
  CurrentScraper,
} from 'src/gql-scrapper-token.guard'
import { BearerGuard } from 'src/oauth2/guards/gql/bearer.guard'
import { CurrentUser } from 'src/users/decorators/gql.decorator'
import { HypervisorService } from './hypervisor.service'

@Resolver()
export class HypervisorResolver {
  private readonly logger = new Logger(HypervisorResolver.name)
  private readonly pubsub = new PubSub()

  public constructor(private readonly hypervisor: HypervisorService) {}

  @UseGuards(GqlScraperAuthGuard)
  @Subscription()
  public tasksDispositions(@CurrentScraper() scraper: Scraper) {
    this.logger.verbose(
      `Scraper "${
        scraper.alias ?? scraper.id
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

  @Mutation()
  @UseGuards(BearerGuard)
  public async createScraper(
    @CurrentUser() user: User,
    @Args('alias') alias?: string,
  ) {
    const scraper = await this.hypervisor.createScraper(user, alias)
    const [token] = scraper.tokens
    return token
  }
}
