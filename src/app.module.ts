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
import { GqlScraperAuthGuard } from './gql-scraper-token.guard'
import { ServeStaticModule } from '@nestjs/serve-static'
import { ConfigModule } from '@nestjs/config'
import { Oauth2Module } from './oauth2/oauth2.module'
import { UsersModule } from './users/users.module'
import { AppResolver } from './app/app.resolver';
import Joi from 'joi'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), '../puppy-spa/dist/'),
      serveRoot: '/',
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
        }),
        subscriptions: {
          'graphql-ws': true,
          'subscriptions-transport-ws': true,
        },
        plugins: [
          process.env.NODE_ENV === 'production'
            ? ApolloServerPluginLandingPageProductionDefault({
                footer: false,
                // @ts-expect-error Apollo mistype
                embed: true,
                headers: {
                  Authorization: 'Bearer <token>',
                },
              })
            : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
        ],
        introspection: true,
        cache: 'bounded',
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
        //GOOGLE_OAUTH_CALLBACK_URL: Joi.string()
        //  .uri({
        //    scheme: ['http', 'https'],
        //  })
        //  .exist(),
        GOOGLE_OAUTH_CLIENT_ID: Joi.string().exist(),
        GOOGLE_OAUTH_CLIENT_SECRET: Joi.string().exist(),
      }),
    }),
    UsersModule,
  ],
  providers: [DateTimeScalar, AppResolver],
})
export class AppModule {}
