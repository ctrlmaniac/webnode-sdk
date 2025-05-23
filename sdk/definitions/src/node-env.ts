import { z } from 'zod/v4';
import { NODE_ENVS } from '@webnode-ecosystem/shared';

export const nodeEnvSchema = z.enum(NODE_ENVS);

export type NodeEnv = z.infer<typeof nodeEnvSchema>