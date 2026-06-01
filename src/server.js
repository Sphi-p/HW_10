import 'dotenv/config';
import { createApp } from './app.js';

// ─── Repository layer (stub) ───────────────────────────────
import { createStubUserRepository } from './repositories/stub/user.repository.stub.js';
import { createStubCommentRepository } from './repositories/stub/comment.repository.stub.js';
import { createStubPostRepository } from './repositories/stub/post.repository.stub.js';
import { createStubTagRepository } from './repositories/stub/tag.repository.stub.js';

// ─── Service layer ─────────────────────────────────────────
import { createUserService } from './services/user.service.js';
import { createPostService } from './services/post.service.js';
import { createCommentService } from './services/comment.service.js';
import { createTagService } from './services/tag.service.js';

// ─── Controller layer ──────────────────────────────────────
import { createUserController } from './controllers/user.controller.js';
import { createPostController } from './controllers/post.controller.js';
import { createCommentController } from './controllers/comment.controller.js';
import { createTagController } from './controllers/tag.controller.js';

// ─── Composition Root ──────────────────────────────────────
// Repositories (stub — in-memory)
const userRepo = createStubUserRepository();
const commentRepo = createStubCommentRepository(userRepo);
const postRepo = createStubPostRepository(userRepo, commentRepo, null);
const tagRepo = createStubTagRepository(postRepo);

// Services
const userService = createUserService({ userRepo });
const postService = createPostService({ postRepo });
const commentService = createCommentService({ commentRepo });
const tagService = createTagService({ tagRepo, postRepo });

// Controllers
const userController = createUserController({ userService });
const postController = createPostController({ postService });
const commentController = createCommentController({ commentService });
const tagController = createTagController({ tagService });

// App
const app = await createApp({
  userController,
  postController,
  commentController,
  tagController,
});

// ─── Start ─────────────────────────────────────────────────
const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || '0.0.0.0';

try {
  await app.listen({ port, host });
  app.log.info(`Server running at http://${host}:${port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
