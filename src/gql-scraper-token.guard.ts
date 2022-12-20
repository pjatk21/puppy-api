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
export class ScraperGuard implements CanActivate {
  public constructor(private readonly prisma: PrismaService) {}

  public async canActivate(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context)

    const { authorization } = gqlContext.getContext().req.headers

    if (!authorization) return false
    const [tokenType, token] = authorization.split(' ')

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

    const c = gqlContext.getContext()
    c.scraper = scraper
    return true
  }
}

export const Scraper = createParamDecorator((_data, ctx) => {
  return GqlExecutionContext.create(ctx).getContext().scraper
})
