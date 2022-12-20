import { Res, UseGuards } from '@nestjs/common'
import { Args, Query, Resolver, ResolveField, Mutation } from '@nestjs/graphql'
import { User } from '@prisma/client'
import { BearerGuard } from 'src/oauth2/guards/gql/bearer.guard'
import { PrismaService } from 'src/prisma/prisma.service'
import { CurrentUser } from './decorators/gql.decorator'
import { UsersService } from './users.service'

@Resolver('User')
@UseGuards(BearerGuard)
export class UsersResolver {
  public constructor(
    private readonly users: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  @Query('me')
  public async user(@CurrentUser() user: User) {
    return user
  }

  @ResolveField('scrapers')
  public async scrapers(@CurrentUser() user: User) {
    return this.prisma.scraper.findMany({
      where: {
        ownerId: user.id,
      },
    })
  }
}
