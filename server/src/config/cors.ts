import 'dotenv/config';

export default {
  whitelist: process.env.CORS_WHITELIST.split(',') || [],
  allowedHeaders: process.env.CORS_ALLOWED_HEADERS.split(',') || [],
};
