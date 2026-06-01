/**
 * @returns {import('../interfaces.js').PostRepository}
 */
export function createStubPostRepository(userRepo, commentRepo, tagRepo) {
  const store = new Map();
  let idCounter = 1;

  const postTagLinks = new Map(); // key: `${postId}-${tagId}` → true

  return {
    async findAll({ status, userId, tagId, page = 1, limit = 20 } = {}) {
      let items = [...store.values()];

      if (status) items = items.filter((p) => p.status === status);
      if (userId) items = items.filter((p) => p.userId === Number(userId));

      if (tagId) {
        const tid = Number(tagId);
        items = items.filter((p) => postTagLinks.has(`${p.id}-${tid}`));
      }

      const total = items.length;
      const data = items
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice((page - 1) * limit, page * limit)
        .map((p) => {
          const user = userRepo.findByIdSync
            ? userRepo.findByIdSync(p.userId)
            : null;
          let commentsCount = 0;
          if (commentRepo.countByPostIdSync) {
            commentsCount = commentRepo.countByPostIdSync(p.id);
          }
          return {
            ...p,
            authorName: user?.name ?? 'Unknown',
            commentsCount,
          };
        });

      return { data, total, page, limit };
    },

    async findById(id) {
      const post = store.get(Number(id));
      if (!post) return null;

      const user = await userRepo.findById(post.userId);

      // comments
      const allComments = commentRepo.findAllByPostIdSync
        ? commentRepo.findAllByPostIdSync(post.id)
        : [];
      const comments = allComments.map((c) => ({ ...c }));

      // tags
      const tags = [];
      for (const [key] of postTagLinks) {
        const [pid, tid] = key.split('-').map(Number);
        if (pid === post.id) {
          const tag = await tagRepo.findById(tid);
          if (tag) tags.push(tag);
        }
      }

      return {
        ...post,
        author: user
          ? { id: user.id, name: user.name, email: user.email }
          : null,
        comments,
        tags,
      };
    },

    async create({ userId, title, body = null, status = 'draft' }) {
      const now = new Date().toISOString();
      const post = {
        id: idCounter++,
        userId: Number(userId),
        title,
        body,
        status,
        createdAt: now,
        updatedAt: now,
      };
      store.set(post.id, post);
      return { ...post };
    },

    async createWithTags({ userId, title, body = null, status = 'draft', tagIds = [] }) {
      const post = await this.create({ userId, title, body, status });

      for (const tagId of tagIds) {
        postTagLinks.set(`${post.id}-${Number(tagId)}`, true);
      }

      return this.findById(post.id);
    },

    async update(id, data) {
      const post = store.get(Number(id));
      if (!post) return null;

      const updated = {
        ...post,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      store.set(post.id, updated);
      return { ...updated };
    },

    async remove(id) {
      const pid = Number(id);
      // clean up tag links
      for (const key of postTagLinks.keys()) {
        const [postId] = key.split('-').map(Number);
        if (postId === pid) postTagLinks.delete(key);
      }
      return store.delete(pid);
    },

    // ---- helpers for stub cross-references ----
    _tagLinks: postTagLinks,
  };
}
