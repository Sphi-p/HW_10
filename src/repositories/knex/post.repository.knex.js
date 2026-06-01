import { db } from '../../db.js';

export function createKnexPostRepository() {
    return {
        async findAll({ status, userId, tagId, page = 1, limit = 20 } = {}) {
            let query = db('posts as p')
                .select(
                    'p.id', 'p.user_id', 'p.title', 'p.body', 'p.status',
                    'p.created_at', 'p.updated_at',
                    'u.name as authorName',
                )
                .join('users as u', 'p.user_id', 'u.id')
                .leftJoin('comments as c', 'p.id', 'c.post_id')
                .countDistinct('c.id as commentsCount')
                .groupBy('p.id', 'u.name');

            if (status) query = query.where('status', status);
            if (userId) query = query.where('posts.user_id', userId);

            if (tagId) {
                query = query
                    .join('post_tags as pt', 'p.id', 'pt.post_id')
                    .where('pt.tag_id', tagId);
            }

            const totalQuery = db('posts as p').count('* as count');
            if (status) totalQuery.where('p.status', status);
            if (userId) totalQuery.where('p.user_id', userId);
            if (tagId) {
                totalQuery
                    .join('post_tags as pt', 'p.id', 'pt.post_id')
                    .where('pt.tag_id', tagId);
            }
            const [{ count }] = await totalQuery;
            const total = Number(count);

            const rows = await query
                .orderBy('p.created_at', 'desc')
                .limit(limit)
                .offset((page - 1) * limit);

            const data = rows.map((r) => ({
                id: r.id,
                userId: r.user_id,
                title: r.title,
                body: r.body,
                status: r.status,
                createdAt: r.created_at,
                updatedAt: r.updated_at,
                authorName: r.authorName,
                commentsCount: Number(r.commentsCount),
            }));

            return { data, total, page, limit };
        },
        
        async findById(id) {
            const [post] = await db("posts as p")
                .select(
                    "p.id", "p.user_id", "p.title", "p.body", "p.status", "p.created_at", "p.updated_at",
                    "u.id", "u.name as author_name", "u.email"
                )
                .join("users as u", "p.user_id", "u.id")
                .where("p.id", id);

            if (!post) {
                return null;
            }

            const tags = await db("tags as t")
                .select("t.id", "t.name")
                .join("post_tags as pt", "t.id", "pt.tag_id")
                .where("pt.post_id", id);

            const comments = await db("comments as c")
                .select("c.id", "c.post_id", "c.author_id", "c.body", "c.created_at", "u.name")
                .leftJoin("users as u", "c.author_id", "u.id")
                .where("c.post_id", id)
                .orderBy("c.created_at", "desc");

            return {
                id: post.id,
                userId: post.user_id,
                title: post.title,
                body: post.body,
                status: post.status,
                createdAt: post.created_at,
                updatedAt: post.updated_at,
                author: {
                    id: post.author_id,
                    name: post.author_name,
                    email: post.author_email,
                },
                comments: comments.map((c) => ({
                    id: c.id,
                    postId: c.post_id,
                    authorId: c.author_id,
                    body: c.body,
                    createdAt: c.created_at,
                    authorName: c.authorName,
                })),
                tags: tags.map((t) => ({ id: t.id, name: t.name })),
            };
        },

        async createWithTags({ userId, title, body = null, status = 'draft', tagIds = [] }) {
            return db.transaction(async (trx) => {
                const [post] = await trx("posts")
                    .insert({ user_id: userId, title, body, status })
                    .returning("*");

                if (tagIds.length > 0) {
                    await trx("post_tags")
                        .insert(
                            tagIds.map((tagId) => ({ post_id: post.id, tag_id: tagId }))
                        );
                }

                return this.findById(post.id);
            });
        },

        async update(id, data) {
            const fields = {};
            if (data.title !== undefined) fields.title = data.title;
            if (data.body !== undefined) fields.body = data.body;
            if (data.status !== undefined) fields.status = data.status;

            const [post] = await db('posts')
                .where({ id })
                .update(fields)
                .returning('*');
            return post ? formatPost(post) : null;
        },

        async remove(id) {
            const deleted = await db('posts').where({ id }).del();
            return deleted > 0;
        },
    }
}