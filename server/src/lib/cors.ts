import cors from 'cors';

import corsConfig from 'config/cors';

import type { Express } from 'express';

export default function useCors(config = corsConfig) {
  return cors({
    allowedHeaders: config.allowedHeaders,
    origin: corsConfig.whitelist,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });
}
