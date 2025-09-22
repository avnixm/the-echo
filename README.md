# The Echo (Vox-style Newsroom)

Vox‑style news site built with Next.js (App Router), TailwindCSS, Neon PostgreSQL, and Drizzle ORM. Includes journalist and admin workflows, approvals/rejections, and a news homepage.

## Stack
- Next.js 15 (App Router), React 19
- TailwindCSS 4
- Neon PostgreSQL + Drizzle ORM
- jose (JWT) + secure cookie sessions
- bcrypt password hashing

## App structure
```
/the-echo
  README.md
  /web             # Next.js app
```

## Key routes
- Public: `/`, `/announcement`, `/news`, `/news/[category]`, `/articles/[slug]`
- Journalist: `/journalist/register`, `/journalist/login`, `/journalist/dashboard`, `/journalist/articles`, `/journalist/articles/new`, `/journalist/articles/[id]`
- Admin: `/admin/login`, `/admin/dashboard`, `/admin/users`, `/admin/approvals`

Notes
- Pending vs approved is derived from `articles.publishedAt` (null=pending).
- Rejections are tagged (`rejected`, `rejection:<reason>`) so admins can provide a reason.

## Setup
1) Install
```bash
cd web
npm install
```
2) Environment (`web/.env.local`)
```env
DATABASE_URL=postgres://user:password@host:port/db
JWT_SECRET=change_me_to_a_random_32_plus_char_string
```
3) Push schema (optional)
```bash
npm run db:push
```
4) Seed (creates admin + sample article)
```bash
npm run seed
```
- Admin: echoAdmin@echo.local / TfQYHh2ykPP1ew$EpCgg

5) Dev server
```bash
npm run dev
```
Open http://localhost:3000

## Scripts
```bash
npm run dev       # start dev
npm run build     # production build
npm run start     # start prod server
npm run seed      # seed admin + article
npm run db:push   # push schema
npm run db:studio # drizzle studio
```

## Image domains
Configured in `web/next.config.ts` (e.g. `i.ibb.co`, `ibb.co`, `images.unsplash.com`, `picsum.photos`). Restart dev server after changes.

## Git tips
```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

License: MIT
