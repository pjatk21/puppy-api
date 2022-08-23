import { Module } from '@nestjs/common'
import { UsersModule } from 'src/users/users.module'
import { BearerStrategy } from './strategies/bearer.strategy'
import { GoogleStrategy } from './strategies/google.strategy'
import { Oauth2Controller } from './oauth2.controller'

@Module({
  controllers: [Oauth2Controller],
  providers: [GoogleStrategy, BearerStrategy],
  imports: [UsersModule],
})
export class Oauth2Module {}
