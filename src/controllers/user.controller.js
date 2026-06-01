/**
 * @param {{ userService: import('../services/user.service.js').ReturnType }} deps
 */
export function createUserController({ userService }) {
  return {
    async list(request, reply) {
      const result = await userService.getUsers(request.query);
      return reply.send(result);
    },

    async getOne(request, reply) {
      const user = await userService.getUser(request.params.id);
      return reply.send(user);
    },

    async create(request, reply) {
      const user = await userService.createUser(request.body);
      return reply.status(201).send(user);
    },

    async update(request, reply) {
      const user = await userService.updateUser(request.params.id, request.body);
      return reply.send(user);
    },

    async remove(request, reply) {
      await userService.deleteUser(request.params.id);
      return reply.status(204).send();
    },
  };
}
