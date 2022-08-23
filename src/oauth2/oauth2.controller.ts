import { Controller, Get, Post, Redirect, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { UsersService } from 'src/users/users.service'
import { SafeProfile } from './strategies/google.strategy'

@Controller('oauth')
export class Oauth2Controller {
  public constructor(private readonly users: UsersService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  public async googleAuth(@Req() req) {
    const profile: SafeProfile = req.user
    const { user, session } = await this.users.loginUser({
      name: profile.displayName,
      email: profile.emails[0].value,
    })
    return { user, session }
  }

  @Post('google')
  @UseGuards(AuthGuard('google'))
  public googleAuthRedirect() {
    return
  }
}
