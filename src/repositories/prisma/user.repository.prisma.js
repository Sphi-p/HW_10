import { prisma } from '../../prisma.js';

function formatUser(user) {
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
    };
}

export function createPrismaUserRepository() {
    return {
        async findAll({ page = 1, limit = 20, role } = {}) {
            const where = {};
            if (role) where.role = role;

            const [data, total] = await Promise.all([
                prisma.user.findMany({
                    where,
                    orderBy: { createdAt: 'desc' },
                    skip: (page - 1) * limit,
                    take: limit,
                }),
                prisma.user.count({ where }),
            ]);

            return {
                data: data.map(formatUser),
                total,
                page,
                limit
            };
        },

        async findById(id) {
            const user = await prisma.user.findUnique({ where: { id } });

            return user ? formatUser(user) : null;
        },

        async create({ email, name, role = "user" }) {
            const user = await prisma.user.create({
                data: { email, name, role },
            });

            return formatUser(user);
        },

        async update(id, data) {
            try {
                const user = await prisma.user.update({
                    where: {
                        id
                    },
                    data
                });

                return formatUser(user);
            } catch (err) {
                if (err.code === "P2025") return null;
                throw err;
            }
        },

        async remove(id) {
            try {
                await prisma.user.delete({
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
    };
}