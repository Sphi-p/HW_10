import { db } from '../../db.js';

export function createKnexTagRepository(postRepo) {
    return {
        async findAll() {
            return db("tags")
                .select("id", "name")
                .orderBy("id");
        },

        async findById(id) {
            const [row] = await db("tags")
                .select("id", "name")
                .where({ id });

            return row || null;
        },

        async findByName(name) {
            const [row] = await db("tags")
                .select("id", "name")
                .where({ name });

            return row || null;
        },

        async create({ name }) {
            const existing = await this.findByName(name);

            if (existing) {
                const { ConflictError } = await import('../../errors/index.js');
                throw new ConflictError(`Tag "${name}" already exists`);
            }

            const [row] = await db("tags")
                .insert({ name }).returning("*");

            return row;
        },

        async attachToPost(postId, tagId) {
            await db("post_tags")
                .insert({
                    post_id: postId,
                    tag_id: tagId
                });
        },

        async detachFromPost(postId, tagId) {
            const deleted = await db("post_tags")
                .where({ post_id: postId, tag_id: tagId })
                .del();

            return deleted > 0;
        }
    }
}