import { PassportStrategy } from '@nestjs/passport'
import { Strategy, VerifyCallback } from 'passport-google-oauth20'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  public constructor(
    private readonly config: ConfigService<NodeJS.ProcessEnv, true>,
  ) {
    super({
      clientID: config.get('GOOGLE_OAUTH_CLIENT_ID'),
      clientSecret: config.get('GOOGLE_OAUTH_CLIENT_SECRET'),
      callbackURL: config.get('GOOGLE_OAUTH_CALLBACK_URL'),
      scope: ['email', 'profile'],
    })
  }

  public async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const { name, emails, photos } = profile
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    }
    return user
  }
}
