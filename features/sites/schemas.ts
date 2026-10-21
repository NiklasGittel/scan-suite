import { z } from 'zod';
import { verifyMethod } from '@/db/schema';

export const VerifySiteInput = z.object({
  siteId: z.uuid({ error: 'Invalid id.' }),
  method: z.enum(verifyMethod.enumValues),
});

export type VerifySiteInput = z.infer<typeof VerifySiteInput>;

const hostnamePattern = /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.(?!-)[a-z0-9-]{1,63}(?<!-))+$/;
const ipPattern = /^\d+(\.\d+)*$/;

export const AddSiteInput = z.object({
  hostname: z
    .string()
    .trim()
    .toLowerCase()
    .transform((value) => value.replace(/^https?:\/\//, '').replace(/[/?#].*$/, '').replace(/\.$/, ''))
    .refine((value) => hostnamePattern.test(value) && !ipPattern.test(value), { error: 'Invalid hostname.' }),
});

export type AddSiteInput = z.infer<typeof AddSiteInput>;
