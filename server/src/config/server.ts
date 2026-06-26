import 'dotenv/config';

export default {
  port: Number(process.env.SERVER_PORT) || 3000,

  apiPrefix: '/api/v1',
};
