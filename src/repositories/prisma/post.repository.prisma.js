import { prisma } from '../../prisma.js';

function formatPost(post) {
    return {
        id: post.id,
        userId: post.userId,
        title: post.title,
        body: post.body,
        status: post.status,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
    };
}

export function createPrismaPostRepository(userRepo, commentRepo, tagRepo) {
    return {
        async findAll({ status, userId, tagId, page = 1, limit = 20 } = {}) {
            const where = {};

            if (status) where.status = status;
            if (userId) where.userId = userId;
            if (tagId) where.tags = { some: { tagId } };

            const [data, total] = await Promise.all([
                prisma.post.findMany({
                    where,
                    include: {
                        user: {
                            select: { id: true, name: true }
                        },
                        _count: {
                            select: { comments: true }
                        }
                    },
                    orderBy: { createdAt: "desc" },
                    skip: (page - 1) * limit,
                    take: limit,
                }),
                prisma.post.count({ where }),
            ]);

            return {
                data: data.map((p) => ({
                    id: p.id,
                    userId: p.userId,
                    title: p.title,
                    body: p.body,
                    status: p.status,
                    createdAt: p.createdAt.toISOString(),
                    updatedAt: p.updatedAt.toISOString(),
                    authorName: p.user.name,
                    commentsCount: p._count.comments,
                })),
                total,
                page,
                limit,
            }
        },

        async findById(id) {
            const post = await prisma.post.findUnique({
                where: { id },
                include: {
                    user: { select: { id: true, name: true } },
                    comments: {
                        include: {
                            author: { select: { id: true, name: true } }
                        },
                        orderBy: { createdAt: "desc" },
                    },
                    tags: {
                        include: {
                            tag: { select: { id: true, name: true } },
                        }
                    }
                }
            });

            if (!post) return null;

            return {
                id: post.id,
                userId: post.userId,
                title: post.title,
                body: post.body,
                status: post.status,
                createdAt: post.createdAt.toISOString(),
                updatedAt: post.updatedAt.toISOString(),
                author: post.user,
                comments: post.comments.map((c) => ({
                    id: c.id,
                    postId: c.postId,
                    authorId: c.authorId,
                    body: c.body,
                    createdAt: c.createdAt.toISOString(),
                    authorName: c.author?.name ?? null,
                })),
                tags: post.tags.map((pt) => pt.tag),
            };
        },

        async create({ userId, title, body = null, status = 'draft' }) {
            const post = prisma.post.create({
                data: { userId, title, body, status },
            });

            return formatPost(post);
        },

        async createWithTags({ userId, title, body = null, status = 'draft', tagIds = [] }) {
            const postDetail = await prisma.$transaction(async (tx) => {
                const created = await tx.post.create({
                    data: {
                        userId, title, body, status,
                        tags: {
                            create: tagIds.map((tagId) => ({
                                tag: { connect: { id: tagId } },
                            })),
                        },
                    },
                });

                return tx.post.findUnique({
                    where: { id: created.id },
                    include: {
                        user: { select: { id: true, name: true, email: true } },
                        comments: {
                            include: { author: { select: { id: true, name: true } } },
                            orderBy: { createdAt: 'desc' },
                        },
                        tags: { include: { tag: { select: { id: true, name: true } } } },
                    },
                });
            });

            return {
                id: postDetail.id,
                userId: postDetail.userId,
                title: postDetail.title,
                body: postDetail.body,
                status: postDetail.status,
                createdAt: postDetail.createdAt.toISOString(),
                updatedAt: postDetail.updatedAt.toISOString(),
                author: postDetail.user,
                comments: postDetail.comments.map((c) => ({
                    id: c.id,
                    postId: c.postId,
                    authorId: c.authorId,
                    body: c.body,
                    createdAt: c.createdAt.toISOString(),
                    authorName: c.author?.name ?? null,
                })),
                tags: postDetail.tags.map((pt) => pt.tag),
            };
        },

        async update(id, data) {
            try {
                const post = await prisma.post.update({
                    where: { id },
                    data
                });

                return formatPost(post);
            } catch (err) {
                if (err.code === 'P2025') return null;
                throw err;
            }
        },

        async remove(id) {
            try {
                await prisma.post.delete({ where: { id } });
                return true;
            } catch (err) {
                if (err.code === 'P2025') return null;
                throw err;
            }
        }
    }
}