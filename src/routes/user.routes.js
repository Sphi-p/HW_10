import { validate } from '../plugins/zod-validator.js';
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
  userQuerySchema,
} from '../schemas/user.schema.js';

/**
 * @param {import('fastify').FastifyInstance} fastify
 * @param {object} controller
 */
export function registerUserRoutes(fastify, controller) {
  fastify.get('/api/users', {
    preHandler: [validate({ query: userQuerySchema })],
    handler: controller.list,
  });

  fastify.get('/api/users/:id', {
    preHandler: [validate({ params: userIdSchema })],
    handler: controller.getOne,
  });

  fastify.post('/api/users', {
    preHandler: [validate({ body: createUserSchema })],
    handler: controller.create,
  });

  fastify.patch('/api/users/:id', {
    preHandler: [validate({ params: userIdSchema, body: updateUserSchema })],
    handler: controller.update,
  });

  fastify.delete('/api/users/:id', {
    preHandler: [validate({ params: userIdSchema })],
    handler: controller.remove,
  });
}
