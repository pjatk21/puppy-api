import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { OAuth2Client, GoogleAuth } from 'google-auth-library'
import { Type, plainToInstance } from 'class-transformer'

export class GoogleProfile {
  @Type(() => String)
  public email: string

  @Type(() => String)
  public name: string
}

@Injectable()
export class Oauth2Service {
  private readonly googleAuth2: OAuth2Client

  public constructor(private readonly config: ConfigService) {
    this.googleAuth2 = new OAuth2Client({
      clientId: config.get('GOOGLE_OAUTH_CLIENT_ID'),
      clientSecret: config.get('GOOGLE_OAUTH_CLIENT_SECRET'),
      redirectUri: 'postmessage', // THIS SHIT IS IMPORTANT, OK?
    })
  }

  public async googleCodeVerify(code: string) {
    const { tokens } = await this.googleAuth2.getToken(code)
    this.googleAuth2.setCredentials(tokens)
    const profile = await this.googleAuth2.request({
      url: 'https://www.googleapis.com/oauth2/v3/userinfo',
    })
    return plainToInstance(GoogleProfile, profile)
  }
}
