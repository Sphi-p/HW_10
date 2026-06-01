import { z } from 'zod';

export const createCommentSchema = z.object({
  authorId: z.number().int().positive('authorId is required'),
  body: z.string().min(1, 'Comment body is required').max(5000),
});

export const commentIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a number').transform(Number),
});

export const commentPostIdSchema = z.object({
  postId: z.string().regex(/^\d+$/, 'post ID must be a number').transform(Number),
});

export const commentQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
