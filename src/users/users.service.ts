import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserInfo } from './users.module'
import { User } from '@prisma/client'

@Injectable()
export class UsersService {
  public constructor(private readonly prisma: PrismaService) {}

  public async getOrCreateUser(userInfo: UserInfo) {
    const { name, email } = userInfo

    // check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) return existingUser

    // create user
    const newUser = await this.prisma.user.create({
      data: {
        name,
        email,
      },
    })

    return newUser
  }

  public createSession(user: User) {
    return this.prisma.userSession.create({ data: { userId: user.id } })
  }

  public async loginUser(userInfo: UserInfo) {
    // get user object
    const user = await this.getOrCreateUser(userInfo)
    // create session
    const session = await this.createSession(user)

    return { user, session }
  }

  public async userFromToken(token: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        sessions: {
          some: {
            token,
          },
        },
      },
    })

    return user
  }
}
