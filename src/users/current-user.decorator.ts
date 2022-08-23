import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext | GqlExecutionContext) => {
    if (context instanceof GqlExecutionContext) {
      return GqlExecutionContext.create(context).getContext().user
    }
    return context.switchToHttp().getRequest().user
  },
)
