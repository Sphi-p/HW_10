import { NotFoundError } from '../errors/index.js';

/**
 * @param {{ commentRepo: import('../repositories/interfaces.js').CommentRepository }} deps
 */
export function createCommentService({ commentRepo }) {
  return {
    async getComments(opts = {}) {
      return commentRepo.findAll(opts);
    },

    async getComment(id) {
      const comment = await commentRepo.findById(id);
      if (!comment) throw new NotFoundError('Comment not found');
      return comment;
    },

    async createComment(data) {
      return commentRepo.create(data);
    },

    async deleteComment(id) {
      const removed = await commentRepo.remove(id);
      if (!removed) throw new NotFoundError('Comment not found');
      return { success: true };
    },
  };
}
