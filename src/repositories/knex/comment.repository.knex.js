import { db } from '../../db.js';

function formatComment(row) {
    return {
        id: row.id,
        postId: row.post_id,
        authorId: row.author_id,
        body: row.body,
        createdAt: row.created_at,
        authorName: row.authorName || null,
    };
}

export function createKnexCommentRepository(userRepo) {
    return {
        async findAll({ postId, page = 1, limit = 20 } = {}) {
            let query = db("comments as c")
                .select(
                    "c.id", "c.post_id", "c.author_id", "c.body", "c.created_at",
                    "u.name"
                )
                .leftJoin("user as u", "c.author_id", "u.id");

            if (postId) query = query.where("c.post_id", postId);

            const totalQuery = db("comments");
            if (postId) totalQuery.where({ post_id: postId });
            const [{ count }] = await totalQuery.count("* as count");
            const total = Number(count);

            const rows = await query
                .orderBy('c.created_at', 'desc')
                .limit(limit)
                .offset((page - 1) * limit);

            return { data: rows.map(formatComment), total, page, limit }
        },

        async findById(id) {
            const [row] = await db("comments")
                .select(
                    "c.id", "c.post_id", "c.author_id", "c.body", "c.created_at",
                    "u.name"
                )
                .leftJoin("user as u", "c.author_id", "u.id")
                .where("c.id", id);

            return row ? formatComment(row) : null;
        },

        async create({ postId, authorId, body }) {
            const [row] = await db("comments")
                .insert({
                    post_id: postId,
                    author_id: authorId, body
                })
                .returning("*");

            return formatComment(row);
        },

        async remove(id) {
            const deleted = await db("comments").where({ id }).del();

            return deleted > 0;
        }
    }
}