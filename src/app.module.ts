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
import { ServeStaticModule } from '@nestjs/serve-static'
import { ConfigModule } from '@nestjs/config'
import { Oauth2Module } from './oauth2/oauth2.module'
import Joi from 'joi'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'static'),
      serveRoot: '/static',
    }),
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
    Oauth2Module,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        GOOGLE_OAUTH_CALLBACK_URL: Joi.string()
          .uri({
            scheme: ['http', 'https'],
          })
          .exist(),
        GOOGLE_OAUTH_CLIENT_ID: Joi.string().exist(),
        GOOGLE_OAUTH_CLIENT_SECRET: Joi.string().exist(),
      }),
    }),
  ],
  providers: [DateTimeScalar],
})
export class AppModule {}
