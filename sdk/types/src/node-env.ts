import type { NodeEnvSchema } from '@webnode-ecosystem/schema';
import { z } from 'zod';

export type NodeEnv = z.infer<typeof NodeEnvSchema>;
