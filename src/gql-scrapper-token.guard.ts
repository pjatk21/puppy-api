import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { PrismaService } from './prisma/prisma.service'

@Injectable()
export class GqlScrapperAuthGuard implements CanActivate {
  public constructor(private readonly prisma: PrismaService) {}

  public async canActivate(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context)

    const { Authorization: authHeader } = gqlContext.getContext() as Partial<{ Authorization: string }> & Record<string, unknown>

    if (!authHeader) return false
    const [tokenType, token] = authHeader.split(' ')

    if (tokenType !== 'Scraper') return false

    const scraper = await this.prisma.scrapper.findFirst({
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

export const CurrentScrapper = createParamDecorator((data, ctx) => {
  return GqlExecutionContext.create(ctx).getContext().scrapper
})
