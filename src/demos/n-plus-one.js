import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient({
    log: ['query'],
});

console.log('=== N+1 Problem Demo ===\n');

console.log('--- ❌ BAD (N+1) ---');
console.time('N+1');

const postsBasic = await prisma.post.findMany({
    where: { status: 'published' },
});

for (const post of postsBasic) {
    const user = await prisma.user.findUnique({
        where: { id: post.userId },
        select: { name: true },
    });
    const commentCount = await prisma.comment.count({
        where: { postId: post.id },
    });
    console.log(`  "${post.title}" by ${user.name}, ${commentCount} comments`);
}

console.timeEnd('N+1');
console.log(`  Запросов: 1 (post list) + ${postsBasic.length} (users) + ${postsBasic.length} (counts) = ${1 + postsBasic.length * 2}\n`);

console.log('--- ✅ GOOD (include) ---');
console.time('include');

const postsGood = await prisma.post.findMany({
    where: { status: 'published' },
    include: {
        user: { select: { name: true } },
        _count: { select: { comments: true } },
    },
});

for (const post of postsGood) {
    console.log(`  "${post.title}" by ${post.user.name}, ${post._count.comments} comments`);
}

console.timeEnd('include');
console.log('  Запросов: 1–2 (findMany + count)');

await prisma.$disconnect();
process.exit(0);