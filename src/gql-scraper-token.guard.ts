import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { PrismaService } from './prisma/prisma.service'
import {} from '@nestjs/mercurius'

@Injectable()
export class GqlScraperAuthGuard implements CanActivate {
  public constructor(private readonly prisma: PrismaService) {}

  public async canActivate(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context)

    console.log(Object.keys(gqlContext.getContext()))

    const { Authorization: authHeader } = gqlContext.getContext()._connectionInit

    if (!authHeader) return false
    const [tokenType, token] = authHeader.split(' ')

    if (tokenType !== 'Scraper') return false

    const scraper = await this.prisma.scraper.findFirst({
      where: {
        tokens: {
          some: {
            token,
          },
        },
      },
    })
    console.log(scraper)

    const c = gqlContext.getContext()
    c.scraper = scraper
    return true
  }
}

export const CurrentScraper = createParamDecorator((data, ctx) => {
  return GqlExecutionContext.create(ctx).getContext().scraper
})
