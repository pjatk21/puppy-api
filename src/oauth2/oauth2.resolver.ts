import { Args, Mutation, Resolver, ResolveField } from '@nestjs/graphql'
import { UserSession } from '@prisma/client'
import { UsersService } from 'src/users/users.service'
import { Oauth2Service } from './oauth2.service'

@Resolver('OAuth2')
export class Oauth2Resolver {
  public constructor(
    private readonly users: UsersService,
    private readonly oauth2: Oauth2Service,
  ) {}

  @Mutation('oauth2')
  public oauth2mutation() {
    return {}
  }

  @ResolveField('google')
  public async googleToken(@Args('code') code: string): Promise<UserSession> {
    const profile = await this.oauth2.googleCodeVerify(code)

    const { session } = await this.users.loginUser(profile)
    return session
  }
}
