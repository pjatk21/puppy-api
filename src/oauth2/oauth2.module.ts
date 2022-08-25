import { Module } from '@nestjs/common'
import { UsersModule } from 'src/users/users.module'
import { BearerStrategy } from './strategies/bearer.strategy'
import { Oauth2Controller } from './oauth2.controller'
import { Oauth2Service } from './oauth2.service'
import { Oauth2Resolver } from './oauth2.resolver'

@Module({
  controllers: [Oauth2Controller],
  providers: [BearerStrategy, Oauth2Service, Oauth2Resolver],
  imports: [UsersModule],
})
export class Oauth2Module {}
