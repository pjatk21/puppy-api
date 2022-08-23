import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { UsersService } from 'src/users/users.service'
import { Strategy } from 'passport-http-bearer'

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy) {
  public constructor(private readonly users: UsersService) {
    super()
  }

  public async validate(accessToken: string) {
    const user = await this.users.userFromToken(accessToken)
    if (!user) throw new UnauthorizedException()

    return user
  }
}
