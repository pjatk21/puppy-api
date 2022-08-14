import { Module } from '@nestjs/common'
import { PuppiesResolver } from './puppies.resolver'

@Module({
  providers: [PuppiesResolver],
})
export class PuppiesModule {}
