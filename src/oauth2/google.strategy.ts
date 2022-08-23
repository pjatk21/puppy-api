import { PassportStrategy } from '@nestjs/passport'
import { Strategy, Profile, StrategyOptions } from 'passport-google-oauth20'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UsersService } from 'src/users/users.service'
import { UserSession } from '@prisma/client'
import Joi from 'joi'

export type SafeProfile = {
  emails: Array<{ value: string }>
  displayName: string
}

const profileValidationSchema = Joi.object<SafeProfile>({
  emails: Joi.array().min(1).required(),
  displayName: Joi.string().required(),
} as Record<keyof Profile, Joi.Schema>)

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  public constructor(
    config: ConfigService<NodeJS.ProcessEnv, true>,
    private readonly users: UsersService,
  ) {
    super({
      clientID: config.get('GOOGLE_OAUTH_CLIENT_ID'),
      clientSecret: config.get('GOOGLE_OAUTH_CLIENT_SECRET'),
      callbackURL: config.get('GOOGLE_OAUTH_CALLBACK_URL'),
      scope: ['email', 'profile'],
      skipUserProfile: false,
    } as StrategyOptions)
  }

  public async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ) {
    const safeProfile: SafeProfile =
      await profileValidationSchema.validateAsync(profile, {
        stripUnknown: true,
      })

    // const user = await this.users.getOrCreateUser({
    //   email: safeProfile.emails[0].value,
    //   name: safeProfile.displayName,
    // })

    //console.log(safeProfile, user)

    return safeProfile
  }
}
