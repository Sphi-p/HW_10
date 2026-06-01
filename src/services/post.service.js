import { NotFoundError } from '../errors/index.js';

/**
 * @param {{ postRepo: import('../repositories/interfaces.js').PostRepository }} deps
 */
export function createPostService({ postRepo }) {
  return {
    async getPosts(opts = {}) {
      return postRepo.findAll(opts);
    },

    async getPost(id) {
      const post = await postRepo.findById(id);
      if (!post) throw new NotFoundError('Post not found');
      return post;
    },

    async createPost(data) {
      if (data.tagIds && data.tagIds.length > 0) {
        return postRepo.createWithTags(data);
      }
      return postRepo.create(data);
    },

    async updatePost(id, data) {
      const post = await postRepo.update(id, data);
      if (!post) throw new NotFoundError('Post not found');
      return post;
    },

    async deletePost(id) {
      const removed = await postRepo.remove(id);
      if (!removed) throw new NotFoundError('Post not found');
      return { success: true };
    },
  };
}
