import { Module } from '@nestjs/common'
import { UsersModule } from 'src/users/users.module'
import { GoogleStrategy } from './google.strategy'
import { Oauth2Controller } from './oauth2.controller'

@Module({
  controllers: [Oauth2Controller],
  providers: [GoogleStrategy],
  imports: [UsersModule]
})
export class Oauth2Module {}
