import { Res, UseGuards } from '@nestjs/common'
import { Args, Query, Resolver, ResolveField } from '@nestjs/graphql'
import { User } from '@prisma/client'
import { BearerGuard } from 'src/oauth2/guards/gql/bearer.guard'
import { CurrentUser } from './decorators/gql.decorator'

@Resolver('User')
@UseGuards(BearerGuard)
export class UsersResolver {
  @Query('me')
  public async user(@CurrentUser() user: User) {
    return user
  }
}
