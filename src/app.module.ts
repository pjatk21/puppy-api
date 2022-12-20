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
import { ScraperGuard } from './gql-scraper-token.guard'
import { ServeStaticModule } from '@nestjs/serve-static'
import { ConfigModule } from '@nestjs/config'
import { Oauth2Module } from './oauth2/oauth2.module'
import { UsersModule } from './users/users.module'
import { AppResolver } from './app/app.resolver'
import Joi from 'joi'
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), '../puppy-spa/dist/'),
      serveRoot: '/',
    }),
    GraphQLModule.forRootAsync<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      useFactory: () => ({
        typePaths: ['./**/*.graphql', './**/*.gql'],
        definitions: {
          path: path.join(process.cwd(), 'src/_autogen/graphql.ts'),
          outputAs: 'class',
        },
        graphiql: true,
        subscription: true,
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
