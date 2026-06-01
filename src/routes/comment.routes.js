import { validate } from '../plugins/zod-validator.js';
import {
  createCommentSchema,
  commentIdSchema,
  commentPostIdSchema,
  commentQuerySchema,
} from '../schemas/comment.schema.js';

/**
 * @param {import('fastify').FastifyInstance} fastify
 * @param {object} controller
 */
export function registerCommentRoutes(fastify, controller) {
  fastify.get('/api/posts/:postId/comments', {
    preHandler: [validate({ params: commentPostIdSchema, query: commentQuerySchema })],
    handler: controller.list,
  });

  fastify.post('/api/posts/:postId/comments', {
    preHandler: [validate({ params: commentPostIdSchema, body: createCommentSchema })],
    handler: controller.create,
  });

  fastify.delete('/api/comments/:id', {
    preHandler: [validate({ params: commentIdSchema })],
    handler: controller.remove,
  });
}
