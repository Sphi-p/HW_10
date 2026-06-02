import { prisma } from '../../prisma.js';

function formatComment(c) {
    return {
        id: c.id,
        postId: c.postId,
        authorId: c.authorId,
        body: c.body,
        createdAt: c.createdAt.toISOString(),
        authorName: c.author?.name ?? null,
    };
}

export function createPrismaCommentRepository(userRepo) {
    return {
        async findAll({ postId, page = 1, limit = 20 } = {}) {
            const where = {};
            if (postId) where.postId = postId;

            const [data, total] = await Promise.all([
                prisma.comment.findMany({
                    where,
                    include: {
                        author: { select: { id: true, name: true } },
                    },
                    orderBy: { createdAt: 'desc' },
                    skip: (page - 1) * limit,
                    take: limit,
                }),
                prisma.comment.count({ where }),
            ]);

            return {
                data: data.map(formatComment),
                total,
                page,
                limit
            };
        },

        async findById(id) {
            const comment = await prisma.comment.findUnique({
                where: { id },
                include: {
                    author: { select: { id: true, name: true } },
                },
            });

            return comment ? formatComment(comment) : null;
        },

        async create({ postId, authorId, body }) {
            const comment = await prisma.comment.create({
                data: {
                    postId,
                    authorId,
                    body
                },
                include: {
                    author: { select: { id: true, name: true } },
                }
            });

            return formatComment(comment);
        },

        async remove(id) {
            try {
                await prisma.comment.delete({
                    where: {
                        id
                    }
                });

                return true;
            } catch (err) {
                if (err.code === "P2025") return false;
                throw err;
            }
        }
    }
}