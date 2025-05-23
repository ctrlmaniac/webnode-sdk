import { BASE_DOMAIN_REGEXP } from '@webnode-ecosystem/shared';
import { z } from 'zod';
import { NodeEnvSchema } from './node-env.ts';

export const processEnvSchema = z.object({
  BASE_DOMAIN: z.string().regex(BASE_DOMAIN_REGEXP, 'BASE_DOMAIN is not valid'),

  PORT: z
    .string()
    .transform((v) => (v ? Number.parseInt(v) : undefined))
    .refine((val) => val && !isNaN(val) && val >= 1 && val <= 65535)
    .optional(),

  SECURE: z
    .union([z.literal('true'), z.literal('false')])
    .transform((val) => val === 'true')
    .optional(),

  NODE_ENV: NodeEnvSchema.optional(),
});
