import { Query, Resolver } from '@nestjs/graphql'
import packageJson from 'package.json' assert { type: 'json' }

@Resolver()
export class AppResolver {
  @Query('app')
  public app() {
    return {
      version: packageJson.version,
    }
  }
}
