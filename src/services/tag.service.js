import { NotFoundError } from '../errors/index.js';

/**
 * @param {{ tagRepo: import('../repositories/interfaces.js').TagRepository, postRepo: import('../repositories/interfaces.js').PostRepository }} deps
 */
export function createTagService({ tagRepo, postRepo }) {
  return {
    async getTags() {
      return tagRepo.findAll();
    },

    async getTag(id) {
      const tag = await tagRepo.findById(id);
      if (!tag) throw new NotFoundError('Tag not found');
      return tag;
    },

    async createTag(data) {
      return tagRepo.create(data);
    },

    async attachTag(postId, tagId) {
      await postRepo.findById(postId); // проверяет существование поста
      const tag = await tagRepo.findById(tagId);
      if (!tag) throw new NotFoundError('Tag not found');

      await tagRepo.attachToPost(postId, tagId);
      return { success: true };
    },

    async detachTag(postId, tagId) {
      await postRepo.findById(postId);
      await tagRepo.detachFromPost(postId, tagId);
      return { success: true };
    },
  };
}
