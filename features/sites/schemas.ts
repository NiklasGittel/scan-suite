import { z } from 'zod';
import { verifyMethod } from '@/db/schema';

export const VerifySiteInput = z.object({
  siteId: z.uuid({ error: 'Invalid id.' }),
  method: z.enum(verifyMethod.enumValues),
});

export type VerifySiteInput = z.infer<typeof VerifySiteInput>;