import { UserSession } from '@prisma/client'

export class UserSessionEntity implements UserSession {
  public token: string
  public userId: string
  public expiresAfter: Date
}
