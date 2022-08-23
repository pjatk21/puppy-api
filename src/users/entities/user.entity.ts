import { User } from '@prisma/client'

export class UserEntity implements User {
  public id: string
  public email: string
  public name: string
}
