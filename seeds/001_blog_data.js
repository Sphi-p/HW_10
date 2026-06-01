export async function seed(knex) {
    await knex("post_tags").del();
    await knex("comments").del();
    await knex("posts").del();
    await knex("tags").del();
    await knex("users").del();

    const users = await knex('users').insert([
        { email: 'alice@test.com', name: 'Alice', role: 'user' },
        { email: 'bob@test.com', name: 'Bob', role: 'user' },
        { email: 'charlie@test.com', name: 'Charlie', role: 'admin' },
        { email: 'diana@test.com', name: 'Diana', role: 'user' },
        { email: 'eve@test.com', name: 'Eve', role: 'user' },
    ]).returning('*');

    const tags = await knex('tags').insert([
        { name: 'javascript' },
        { name: 'nodejs' },
        { name: 'databases' },
        { name: 'devops' },
        { name: 'architecture' },
    ]).returning('*');

    const titles = [
        'Knex basics: getting started',
        'Prisma vs Knex: when to use what',
        'SQL tricks you didnt know',
        'Database migrations best practices',
        'Writing effective seeds',
        'Understanding the N+1 problem',
        'Transactions in Node.js',
        'JOINs in depth',
        'Connection pooling explained',
        'ORM vs Query Builder',
    ];

    const posts = [];
    for (let i = 0; i < 10; i++) {
        const [post] = await knex('posts').insert({
            user_id: users[i % users.length].id,
            title: `Post ${i + 1}: ${titles[i]}`,
            body: `Body of post ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
            status: i % 3 === 0 ? 'draft' : 'published',
        }).returning('*');
        posts.push(post);
    }

    for (let i = 0; i < 10; i++) {
        await knex('post_tags').insert([
            { post_id: posts[i].id, tag_id: tags[i % tags.length].id },
            { post_id: posts[i].id, tag_id: tags[(i + 1) % tags.length].id },
        ]);
    }

    for (let i = 0; i < 20; i++) {
        await knex('comments').insert({
            post_id: posts[i % posts.length].id,
            author_id: users[(i + 1) % users.length].id,
            body: `Comment ${i + 1}: Great article, very informative!`,
        });
    }
}