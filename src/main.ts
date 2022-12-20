import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { AppModule } from './app.module'

async function bootstrap() {
  const adapter = new FastifyAdapter()
  // adapter.disable('x-powered-by')

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
    { cors: true },
  )
  await app.listen(3000)
}

void bootstrap()
