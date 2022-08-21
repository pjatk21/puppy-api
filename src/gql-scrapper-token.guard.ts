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

    const { scrapperToken } = gqlContext.getContext()

    if (!scrapperToken) return false

    const scrapper = await this.prisma.scrapper.findFirst({
      where: {
        tokens: {
          some: {
            token: gqlContext.getContext().scrapperToken,
          },
        },
      },
    })

    const c = gqlContext.getContext()
    c.scrapper = scrapper
    return true
  }
}

export const CurrentScrapper = createParamDecorator((data, ctx) => {
  return GqlExecutionContext.create(ctx).getContext().scrapper
})
