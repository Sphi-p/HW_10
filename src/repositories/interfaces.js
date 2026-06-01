/**
 * ============================================================
 *  КОНТРАКТЫ РЕПОЗИТОРИЕВ
 * ============================================================
 *
 *  Каждая реализация (stub / knex / prisma) должна
 *  возвращать объект с **теми же методами и сигнатурами**.
 *
 *  Функция-фабрика не принимает аргументов (stub)
 *  или принимает зависимость (knex: db, prisma: prisma).
 * ============================================================
 */

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} email
 * @property {string} name
 * @property {string} role - "user" | "admin"
 * @property {string} createdAt - ISO
 * @property {string} updatedAt - ISO
 */

/**
 * @typedef {Object} PaginatedResult
 * @property {Array} data
 * @property {number} total
 * @property {number} page
 * @property {number} limit
 */

/**
 * UserRepository
 * @typedef {Object} UserRepository
 * @property {(opts?: { page?: number, limit?: number, role?: string }) => Promise<PaginatedResult<User>>} findAll
 * @property {(id: number) => Promise<User|null>} findById
 * @property {(data: { email: string, name: string, role?: string }) => Promise<User>} create
 * @property {(id: number, data: { email?: string, name?: string, role?: string }) => Promise<User|null>} update
 * @property {(id: number) => Promise<boolean>} remove
 */

/**
 * @typedef {Object} Post
 * @property {number} id
 * @property {number} userId
 * @property {string} title
 * @property {string|null} body
 * @property {string} status - "draft" | "published"
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} PostRow — пост с автором для списка
 * @property {number} id
 * @property {number} userId
 * @property {string} title
 * @property {string|null} body
 * @property {string} status
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} authorName
 * @property {number} commentsCount
 */

/**
 * @typedef {Object} TagItem
 * @property {number} id
 * @property {string} name
 */

/**
 * @typedef {Object} CommentItem
 * @property {number} id
 * @property {number} postId
 * @property {number|null} authorId
 * @property {string} body
 * @property {string} createdAt
 * @property {string} [authorName]
 */

/**
 * @typedef {Object} PostDetail — пост с полной информацией
 * @property {number} id
 * @property {number} userId
 * @property {string} title
 * @property {string|null} body
 * @property {string} status
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {{ id: number, name: string, email: string }} author
 * @property {CommentItem[]} comments
 * @property {TagItem[]} tags
 */

/**
 * PostRepository
 * @typedef {Object} PostRepository
 * @property {(opts?: { status?: string, userId?: number, tagId?: number, page?: number, limit?: number }) => Promise<PaginatedResult<PostRow>>} findAll
 * @property {(id: number) => Promise<PostDetail|null>} findById
 * @property {(data: { userId: number, title: string, body?: string, status?: string }) => Promise<Post>} create
 * @property {(data: { userId: number, title: string, body?: string, status?: string, tagIds: number[] }) => Promise<PostDetail>} createWithTags
 * @property {(id: number, data: { title?: string, body?: string, status?: string }) => Promise<Post|null>} update
 * @property {(id: number) => Promise<boolean>} remove
 */

/**
 * CommentRepository
 * @typedef {Object} CommentRepository
 * @property {(opts?: { postId?: number, page?: number, limit?: number }) => Promise<PaginatedResult<CommentItem>>} findAll
 * @property {(id: number) => Promise<CommentItem|null>} findById
 * @property {(data: { postId: number, authorId: number, body: string }) => Promise<CommentItem>} create
 * @property {(id: number) => Promise<boolean>} remove
 */

/**
 * TagRepository
 * @typedef {Object} TagRepository
 * @property {() => Promise<TagItem[]>} findAll
 * @property {(id: number) => Promise<TagItem|null>} findById
 * @property {(name: string) => Promise<TagItem|null>} findByName
 * @property {(data: { name: string }) => Promise<TagItem>} create
 * @property {(postId: number, tagId: number) => Promise<void>} attachToPost
 * @property {(postId: number, tagId: number) => Promise<boolean>} detachFromPost
 */
