import type { processEnvSchema } from '@webnode-ecosystem/schema';
import { z } from 'zod';

export type processEnv = z.infer<typeof processEnvSchema>;
