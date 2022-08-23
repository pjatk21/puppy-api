import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { UsersService } from './users.service'
import { UsersResolver } from './users.resolver';

export type UserInfo = {
  email: string
  name: string
}

@Module({
  imports: [PrismaModule],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
