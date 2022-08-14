import { NestFactory } from '@nestjs/core'
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express'
import { AppModule } from './app.module'

const adapter = new ExpressAdapter()
adapter.disable('x-powered-by')

const app = await NestFactory.create<NestExpressApplication>(
  AppModule,
  adapter,
  { cors: true },
  // new FastifyAdapter(),
)
await app.listen(3000)
