import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { ScheduleService } from './schedule.service'

@Resolver()
export class ScheduleResolver {
  constructor(private readonly schedule: ScheduleService) {}

  @Mutation()
  processFragment(@Args('html') raw: string) {
    return this.schedule.processShard(raw)
  }
}
