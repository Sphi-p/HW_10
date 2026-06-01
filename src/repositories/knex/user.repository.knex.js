import { email, formatError } from 'zod/v4';
import { db } from '../../db.js';

function formatUser(row) {
    return {
        id: row.id,
        email: row.email,
        name: row.name,
        role: row.role,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

export function createKnexUserRepository() {
    return {
        async findAll({ page = 1, limit = 20, role } = {}) {
            let query = db("users")
                .select("id", "email", "name", "role", "created_at", "updated_at");
            if (role) query = query.where({ role });

            const totalResult = await db('users')
                .count('* as count')
                .modify((q) => { if (role) q.where({ role }); });
            const total = Number(totalResult[0].count);

            const rows = await query
                .orderBy('created_at', 'desc')
                .limit(limit)
                .offset((page - 1) * limit);

            return { data: rows.map(formatUser), total, page, limit };
        },
        
        async findById(id) {
            const [user] = await db("users")
                .select("id", "email", "name", "role", "created_at", "updated_at")
                .where({ id });

            return user ? formatUser(user) : null;
        },

        async create(data) {
            const [user] = await db("users")
                .insert({
                    email: data.email,
                    name: data.name,
                    role: data.role || "user"
                })
                .returning(["id", "email", "name", "role", "created_at", "updated_at"]);

            return formatUser(user);
        },

        async update(id, data) {
            const [user] = await db("users")
                .update(data)
                .where({ id })
                .returning(["id", "email", "name", "role", "created_at", "updated_at"]);

            return user ? formatUser(user) : null;
        },

        async remove(id) {
            const deleted = await db("users").where({ id }).del();

            return deleted > 0;
        },
    };
}