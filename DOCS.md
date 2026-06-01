# ДЗ #8: Knex Query Builder + Prisma ORM

## Быстрый старт (stub — in-memory)

```bash
npm install
npm start
```

Сервер поднимется на `http://localhost:3000`. Данные хранятся в памяти (Map) и сбрасываются при перезапуске.

Полное задание — в файле [`task.md`](./task.md).

Ветка с решением — `helper`.

## Эндпоинты

| Метод   | Путь                              | Описание                        |
| ------- | --------------------------------- | ------------------------------- |
| GET     | /api/users                        | Список (?role=&page=&limit=)    |
| GET     | /api/users/:id                    | Один пользователь               |
| POST    | /api/users                        | Создать пользователя            |
| PATCH   | /api/users/:id                    | Обновить пользователя           |
| DELETE  | /api/users/:id                    | Удалить пользователя            |
| GET     | /api/posts                        | Список (?status=&tagId=&page=)  |
| GET     | /api/posts/:id                    | Один пост + автор + теги        |
| POST    | /api/posts                        | Создать пост                    |
| PATCH   | /api/posts/:id                    | Обновить пост                   |
| DELETE  | /api/posts/:id                    | Удалить пост                    |
| GET     | /api/tags                         | Все теги                        |
| POST    | /api/tags                         | Создать тег                     |
| POST    | /api/posts/:postId/tags/:tagId    | Привязать тег к посту           |
| DELETE  | /api/posts/:postId/tags/:tagId    | Отвязать тег от поста           |
| GET     | /api/posts/:postId/comments       | Комментарии к посту             |
| POST    | /api/posts/:postId/comments       | Добавить комментарий            |
| DELETE  | /api/comments/:id                 | Удалить комментарий             |

## Архитектура

```
server.js (Composition Root)
  → repositories/   — доступ к данным (stub → Knex → Prisma)
  → services/       — бизнес-логика (не знает про HTTP)
  → controllers/    — HTTP-обёртки (req → service → reply)
  → routes/         — привязка URL к контроллерам + Zod-валидация
```

Студенты меняют **только** `repositories/` — всё остальное работает без изменений.
