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
  public processFragment(@Args('html') raw: string) {
    return this.schedule.processShard(raw)
  }

  @Query()
  public availableGroups() {
    return this.schedule.availableGroups()
  }

  @Query()
  public availableHosts() {
    return this.schedule.availableHosts()
  }

  @Query()
  public allEvents(@Args() query: ScheduledEventsQuery) {
    return this.schedule.allEvents(query)
  }

  @Query()
  public rangeEvents(@Args() query: ScheduledEventsRangeQuery) {
    return this.schedule.rangeEvents(query)
  }
}
