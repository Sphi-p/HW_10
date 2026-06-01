import { ZodError } from 'zod';
import { ValidationError } from '../errors/index.js';

/**
 * Создаёт Fastify preHandler для валидации через Zod.
 * @param {{ body?, params?, query? }} schemas
 */
export function validate({ body, params, query } = {}) {
  return async (request, reply) => {
    const targets = { body, params, query };

    for (const [target, schema] of Object.entries(targets)) {
      if (!schema) continue;

      const result = schema.safeParse(request[target]);
      if (!result.success) {
        const messages = result.error.issues
          .map((i) => `${i.path.join('.')}: ${i.message}`)
          .join('; ');
        throw new ValidationError(messages);
      }

      request[target] = result.data;
    }
  };
}
