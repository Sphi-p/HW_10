/**
 * @returns {import('../interfaces.js').TagRepository}
 */
export function createStubTagRepository(postRepo) {
  const store = new Map();
  let idCounter = 1;

  return {
    async findAll() {
      return [...store.values()].sort((a, b) => a.id - b.id);
    },

    async findById(id) {
      return store.get(Number(id)) ?? null;
    },

    async findByName(name) {
      for (const tag of store.values()) {
        if (tag.name === name) return { ...tag };
      }
      return null;
    },

    async create({ name }) {
      const existing = await this.findByName(name);
      if (existing) {
        const { ConflictError } = await import('../../errors/index.js');
        throw new ConflictError(`Tag "${name}" already exists`);
      }
      const tag = { id: idCounter++, name };
      store.set(tag.id, tag);
      return { ...tag };
    },

    async attachToPost(postId, tagId) {
      if (postRepo?._tagLinks) {
        postRepo._tagLinks.set(`${Number(postId)}-${Number(tagId)}`, true);
      }
    },

    async detachFromPost(postId, tagId) {
      const key = `${Number(postId)}-${Number(tagId)}`;
      if (postRepo?._tagLinks) {
        return postRepo._tagLinks.delete(key);
      }
      return false;
    },
  };
}
