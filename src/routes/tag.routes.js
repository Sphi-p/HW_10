import { validate } from '../plugins/zod-validator.js';
import {
  createTagSchema,
  postTagParamsSchema,
} from '../schemas/tag.schema.js';
import { postIdSchema } from '../schemas/post.schema.js';

/**
 * @param {import('fastify').FastifyInstance} fastify
 * @param {object} controller
 */
export function registerTagRoutes(fastify, controller) {
  fastify.get('/api/tags', {
    handler: controller.list,
  });

  fastify.post('/api/tags', {
    preHandler: [validate({ body: createTagSchema })],
    handler: controller.create,
  });

  fastify.post('/api/posts/:postId/tags/:tagId', {
    preHandler: [validate({ params: postTagParamsSchema })],
    handler: controller.attach,
  });

  fastify.delete('/api/posts/:postId/tags/:tagId', {
    preHandler: [validate({ params: postTagParamsSchema })],
    handler: controller.detach,
  });
}
