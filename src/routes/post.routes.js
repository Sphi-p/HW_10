import { validate } from '../plugins/zod-validator.js';
import {
  createPostSchema,
  updatePostSchema,
  postIdSchema,
  postQuerySchema,
} from '../schemas/post.schema.js';

/**
 * @param {import('fastify').FastifyInstance} fastify
 * @param {object} controller
 */
export function registerPostRoutes(fastify, controller) {
  fastify.get('/api/posts', {
    preHandler: [validate({ query: postQuerySchema })],
    handler: controller.list,
  });

  fastify.get('/api/posts/:id', {
    preHandler: [validate({ params: postIdSchema })],
    handler: controller.getOne,
  });

  fastify.post('/api/posts', {
    preHandler: [validate({ body: createPostSchema })],
    handler: controller.create,
  });

  fastify.patch('/api/posts/:id', {
    preHandler: [validate({ params: postIdSchema, body: updatePostSchema })],
    handler: controller.update,
  });

  fastify.delete('/api/posts/:id', {
    preHandler: [validate({ params: postIdSchema })],
    handler: controller.remove,
  });
}
