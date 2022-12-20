import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import {
  ScheduledEventsQuery,
  ScheduledEventsRangeQuery,
  ScheduleService,
} from './schedule.service'

@Resolver()
export class ScheduleResolver {
  public constructor(private readonly schedule: ScheduleService) {}

  @Mutation()
  public async processShard(@Args('payload') payload: string) {
    await this.schedule.storePayload(payload, 0)
    return true
  }
}
