import { Module } from '@nestjs/common'
import { UsersModule } from 'src/users/users.module'
import { BearerStrategy } from './strategies/bearer.strategy'
import { Oauth2Controller } from './oauth2.controller'
import { Oauth2Service } from './oauth2.service'

@Module({
  controllers: [Oauth2Controller],
  providers: [BearerStrategy, Oauth2Service],
  imports: [UsersModule],
})
export class Oauth2Module {}
