/**
 * @param {{ tagService: import('../services/tag.service.js').ReturnType }} deps
 */
export function createTagController({ tagService }) {
  return {
    async list(request, reply) {
      const tags = await tagService.getTags();
      return reply.send(tags);
    },

    async create(request, reply) {
      const tag = await tagService.createTag(request.body);
      return reply.status(201).send(tag);
    },

    async attach(request, reply) {
      await tagService.attachTag(request.params.postId, request.params.tagId);
      return reply.send({ success: true });
    },

    async detach(request, reply) {
      await tagService.detachTag(request.params.postId, request.params.tagId);
      return reply.status(204).send();
    },
  };
}
