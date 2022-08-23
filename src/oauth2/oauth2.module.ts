import { Module } from '@nestjs/common'
import { GoogleStrategy } from './google.strategy'
import { Oauth2Controller } from './oauth2.controller'

@Module({
  controllers: [Oauth2Controller],
  providers: [GoogleStrategy],
})
export class Oauth2Module {}
