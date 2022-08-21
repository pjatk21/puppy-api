import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GqlExecutionContext, GraphQLModule } from '@nestjs/graphql'
import path from 'path'
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core'
import { PuppiesModule } from './puppies/puppies.module'
import { PrismaModule } from './prisma/prisma.module'
import { ScheduleModule } from './schedule/schedule.module'
import { DateTimeScalar } from './datetime.scalar'
import { HypervisorModule } from './hypervisor/hypervisor.module'
import { PrismaService } from './prisma/prisma.service'
import { GqlScrapperAuthGuard } from './gql-scrapper-token.guard'

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: () => ({
        typePaths: ['./**/*.graphql', './**/*.gql'],
        definitions: {
          path: path.join(process.cwd(), 'src/_autogen/graphql.ts'),
          outputAs: 'class',
        },
        playground: false,
        context: (context) => ({
          ...context,
          scrapperToken: context.connectionParams?.scrapperToken ?? null,
        }),
        subscriptions: {
          'graphql-ws': true,
          'subscriptions-transport-ws': true,
        },
        plugins: [
          ApolloServerPluginLandingPageLocalDefault({ footer: false }),
          // ApolloServerPluginLandingPageProductionDefault({ footer: false }),
        ],
      }),
    }),
    PrismaModule,
    PuppiesModule,
    ScheduleModule,
    HypervisorModule,
  ],
  providers: [DateTimeScalar],
})
export class AppModule {}
