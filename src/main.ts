import { NestFactory } from '@nestjs/core'
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express'
import { AppModule } from './app.module'

async function bootstrap() {
  const adapter = new ExpressAdapter()
  adapter.disable('x-powered-by')

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    adapter,
    { cors: true },
  )
  await app.listen(3000)
}

void bootstrap()
