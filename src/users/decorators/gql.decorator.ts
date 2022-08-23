import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

export const CurrentUser = createParamDecorator(
  (data: unknown, context: GqlExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(context)
    return gqlContext.getContext().req.user
  },
)
