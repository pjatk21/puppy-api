import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
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
import { HypervisorModule } from './hypervisor/hypervisor.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql', './**/*.gql'],
      definitions: {
        path: path.join(process.cwd(), 'src/_autogen/graphql.ts'),
        outputAs: 'class',
      },
      playground: false,
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
      plugins: [
        ApolloServerPluginLandingPageLocalDefault({ footer: false }),
        // ApolloServerPluginLandingPageProductionDefault({ footer: false }),
      ],
    }),
    PuppiesModule,
    PrismaModule,
    ScheduleModule,
    HypervisorModule,
  ],
  providers: [DateTimeScalar],
})
export class AppModule {}
