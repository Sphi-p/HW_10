/**
 * @returns {import('../interfaces.js').CommentRepository}
 */
export function createStubCommentRepository(userRepo) {
  const store = new Map();
  let idCounter = 1;

  return {
    async findAll({ postId, page = 1, limit = 20 } = {}) {
      let items = [...store.values()];
      if (postId) items = items.filter((c) => c.postId === Number(postId));

      const total = items.length;
      const data = items
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice((page - 1) * limit, page * limit);

      return { data, total, page, limit };
    },

    async findById(id) {
      const comment = store.get(Number(id));
      if (!comment) return null;
      const user = await userRepo.findById(comment.authorId);
      return { ...comment, authorName: user?.name ?? null };
    },

    async create({ postId, authorId, body }) {
      const now = new Date().toISOString();
      const comment = {
        id: idCounter++,
        postId: Number(postId),
        authorId: Number(authorId),
        body,
        createdAt: now,
      };
      store.set(comment.id, comment);
      return { ...comment };
    },

    async remove(id) {
      return store.delete(Number(id));
    },

    // ---- helpers for stub cross-references (sync) ----
    countByPostIdSync(postId) {
      let count = 0;
      for (const c of store.values()) {
        if (c.postId === Number(postId)) count++;
      }
      return count;
    },

    findAllByPostIdSync(postId) {
      const result = [];
      for (const c of store.values()) {
        if (c.postId === Number(postId)) {
          result.push({ ...c });
        }
      }
      return result.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    },
  };
}
