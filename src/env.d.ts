declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: 'development' | 'production' | 'test'
      GOOGLE_OAUTH_CLIENT_ID?: string
      GOOGLE_OAUTH_CLIENT_SECRET?: string
      GOOGLE_OAUTH_CALLBACK_URL?: string
    }
  }
}

export {}
