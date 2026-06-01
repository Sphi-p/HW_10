import Fastify from 'fastify';
import cors from '@fastify/cors';
import { ZodError } from 'zod';
import { AppError } from './errors/index.js';

/**
 * Создаёт и настраивает Fastify-приложение.
 * Не знает про конкретные репозитории — только про роуты/контроллеры.
 */
export async function createApp(controllers) {
  const fastify = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
      transport:
        process.env.NODE_ENV === 'development'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
    },
  });

  // CORS
  await fastify.register(cors, {
    origin: process.env.CORS_ORIGIN || '*',
  });

  // Глобальный error handler
  fastify.setErrorHandler((err, request, reply) => {
    if (err instanceof AppError) {
      return reply.status(err.statusCode).send({ error: err.message });
    }

    if (err instanceof ZodError) {
      const messages = err.issues
        .map((i) => `${i.path.join('.')}: ${i.message}`)
        .join('; ');
      return reply.status(400).send({ error: messages });
    }

    request.log.error(err);
    return reply.status(500).send({ error: 'Internal Server Error' });
  });

  // Health check
  fastify.get('/health', async () => ({ status: 'ok' }));

  // Регистрируем роуты
  const {
    registerUserRoutes,
  } = await import('./routes/user.routes.js');
  const { registerPostRoutes } = await import('./routes/post.routes.js');
  const {
    registerCommentRoutes,
  } = await import('./routes/comment.routes.js');
  const { registerTagRoutes } = await import('./routes/tag.routes.js');

  registerUserRoutes(fastify, controllers.userController);
  registerPostRoutes(fastify, controllers.postController);
  registerCommentRoutes(fastify, controllers.commentController);
  registerTagRoutes(fastify, controllers.tagController);

  return fastify;
}
