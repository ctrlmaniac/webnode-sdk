import { z } from 'zod';
import { NODE_ENVS } from '@webnode-ecosystem/shared';

export const NodeEnvSchema = z.enum(NODE_ENVS);
