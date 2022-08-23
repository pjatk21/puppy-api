import { Controller, Get, Post, Redirect, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Controller('oauth')
export class Oauth2Controller {
  @Get('google')
  @UseGuards(AuthGuard('google'))
  public async googleAuth(@Req() req) {
    console.log(req.user)
    return { user: req.user }
  }

  @Post('google')
  @UseGuards(AuthGuard('google'))
  public googleAuthRedirect() {
    return
  }
}
