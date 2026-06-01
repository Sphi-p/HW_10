/**
 * @param {{ postService: import('../services/post.service.js').ReturnType }} deps
 */
export function createPostController({ postService }) {
  return {
    async list(request, reply) {
      const result = await postService.getPosts(request.query);
      return reply.send(result);
    },

    async getOne(request, reply) {
      const post = await postService.getPost(request.params.id);
      return reply.send(post);
    },

    async create(request, reply) {
      const post = await postService.createPost(request.body);
      return reply.status(201).send(post);
    },

    async update(request, reply) {
      const post = await postService.updatePost(request.params.id, request.body);
      return reply.send(post);
    },

    async remove(request, reply) {
      await postService.deletePost(request.params.id);
      return reply.status(204).send();
    },
  };
}
