import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { UsersService } from 'src/users/users.service'
import { Oauth2Service } from './oauth2.service'

@Controller('oauth')
export class Oauth2Controller {
  public constructor(
    private readonly users: UsersService,
    private readonly oauth2: Oauth2Service,
  ) {}

  @Get('google')
  public async googleAuth(@Query('code') code?: string) {
    if (!code) throw new BadRequestException('Missing code param.')

    const profile = await this.oauth2.googleCodeVerify(code)

    const { user, session } = await this.users.loginUser(profile)
    return { user, session }
  }
}
