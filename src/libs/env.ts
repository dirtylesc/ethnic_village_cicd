import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const Env = createEnv({
  server: {

  },
  client: {
    NEXT_PUBLIC_CLIENT_URI: z.string().optional(),
    NEXT_PUBLIC_SERVER_URI: z.string().optional(),

  },
  shared: {
    NODE_ENV: z.enum(['test', 'development', 'production']).optional(),
  },

  runtimeEnv: {
    NEXT_PUBLIC_CLIENT_URI: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SERVER_URI: process.env.NEXT_PUBLIC_SERVER_URI,
    NODE_ENV: process.env.NODE_ENV,
  },
});
