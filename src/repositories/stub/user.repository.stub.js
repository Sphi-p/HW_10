import crypto from 'node:crypto';

/**
 * @returns {import('../interfaces.js').UserRepository}
 */
export function createStubUserRepository() {
  const store = new Map();
  let idCounter = 1;

  return {
    async findAll({ page = 1, limit = 20, role } = {}) {
      let items = [...store.values()];
      if (role) items = items.filter((u) => u.role === role);

      const total = items.length;
      const data = items
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice((page - 1) * limit, page * limit);

      return { data, total, page, limit };
    },

    async findById(id) {
      return store.get(Number(id)) ?? null;
    },

    async create({ email, name, role = 'user' }) {
      const now = new Date().toISOString();
      const user = {
        id: idCounter++,
        email,
        name,
        role,
        createdAt: now,
        updatedAt: now,
      };
      store.set(user.id, user);
      return { ...user };
    },

    async update(id, data) {
      const user = store.get(Number(id));
      if (!user) return null;

      const updated = {
        ...user,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      store.set(user.id, updated);
      return { ...updated };
    },

    async remove(id) {
      return store.delete(Number(id));
    },
  };
}
