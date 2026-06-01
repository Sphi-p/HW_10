import { z } from 'zod';

export const createPostSchema = z.object({
  userId: z.number().int().positive('userId is required'),
  title: z.string().min(1, 'Title is required').max(300, 'Title must be ≤ 300 chars'),
  body: z.string().max(10000).optional(),
  status: z.enum(['draft', 'published']).default('draft'),
  tagIds: z.array(z.number().int().positive()).default([]),
});

export const updatePostSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  body: z.string().max(10000).optional(),
  status: z.enum(['draft', 'published']).optional(),
});

export const postIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a number').transform(Number),
});

export const postQuerySchema = z.object({
  status: z.enum(['draft', 'published']).optional(),
  userId: z.coerce.number().int().positive().optional(),
  tagId: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
