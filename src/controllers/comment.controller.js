/**
 * @param {{ commentService: import('../services/comment.service.js').ReturnType }} deps
 */
export function createCommentController({ commentService }) {
  return {
    async list(request, reply) {
      const result = await commentService.getComments({
        postId: request.params.postId,
        ...request.query,
      });
      return reply.send(result);
    },

    async create(request, reply) {
      const comment = await commentService.createComment({
        postId: request.params.postId,
        ...request.body,
      });
      return reply.status(201).send(comment);
    },

    async remove(request, reply) {
      await commentService.deleteComment(request.params.id);
      return reply.status(204).send();
    },
  };
}
