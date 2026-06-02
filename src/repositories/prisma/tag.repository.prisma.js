import { prisma } from '../../prisma.js';
import { ConflictError } from '../../errors/index.js';

export function createPrismaTagRepository(postRepo) {
    return {
        async findAll() {
            return prisma.tag.findMany({
                orderBy: {
                    id: "asc"
                }
            });
        },

        async findById(id) {
            return prisma.tag.findUnique({
                where: { id }
            });
        },

        async findByName(name) {
            return prisma.tag.findUnique({
                where: { name }
            });
        },

        async create({ name }) {
            const existing = await this.findByName(name);
            if (existing) throw new ConflictError(`Tag "${name}" already exists`);

            return prisma.tag.create({ data: { name } });
        },

        async attachToPost(postId, tagId) {
            await prisma.postTag.create({
                data: { postId, tagId },
            });
        },

        async detachFromPost(postId, tagId) {
            try {
                await prisma.postTag.delete({
                    where: {
                        postId_tagId: { postId, tagId }
                    },
                });

                return true;
            } catch (err) {
                if (err.code === "P2025") return false;
                throw err;
            }
        }
    }
}