import { z } from 'zod';

export const createTagSchema = z.object({
  name: z.string().min(1, 'Tag name is required').max(50, 'Tag name must be ≤ 50 chars'),
});

export const tagIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a number').transform(Number),
});

export const postTagParamsSchema = z.object({
  postId: z.string().regex(/^\d+$/, 'post ID must be a number').transform(Number),
  tagId: z.string().regex(/^\d+$/, 'tag ID must be a number').transform(Number),
});
