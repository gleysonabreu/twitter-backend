import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  FRONTEND_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3333),
  PUBLIC_KEY_JWT: z.string(),
  PRIVATE_KEY_JWT: z.string(),
  RESEND_API_KEY: z.string(),
  CLOUDFLARE_ID: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_BUCKET_NAME: z.string(),
});

export type Env = z.infer<typeof envSchema>;
