declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';

      SERVER_PORT: string;

      CORS_WHITELIST: string;
      CORS_ALLOWED_HEADERS: string;

      DATABASE_URL: string;
    }
  }
}

export {};
