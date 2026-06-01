import { NotFoundError, ConflictError } from '../errors/index.js';

/**
 * @param {{ userRepo: import('../repositories/interfaces.js').UserRepository }} deps
 */
export function createUserService({ userRepo }) {
  return {
    async getUsers(opts = {}) {
      return userRepo.findAll(opts);
    },

    async getUser(id) {
      const user = await userRepo.findById(id);
      if (!user) throw new NotFoundError('User not found');
      return user;
    },

    async createUser(data) {
      return userRepo.create(data);
    },

    async updateUser(id, data) {
      const user = await userRepo.update(id, data);
      if (!user) throw new NotFoundError('User not found');
      return user;
    },

    async deleteUser(id) {
      const removed = await userRepo.remove(id);
      if (!removed) throw new NotFoundError('User not found');
      return { success: true };
    },
  };
}
