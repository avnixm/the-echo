# The Echo – School Publication (Next.js + Tailwind + Drizzle + Neon)

The Echo is a Vox-inspired school publication site featuring bold headlines, clean typography, card-based previews, and a responsive grid with sidebar. It includes custom authentication (bcrypt + JWT cookies), role-based dashboards (journalist/admin), article CRUD, admin approvals, and tag-based sections.

## Tech Stack
- Next.js App Router (TypeScript)
- Tailwind CSS
- Drizzle ORM + Neon (serverless PostgreSQL)
- Auth: bcrypt for hashing, jose (JWT) for sessions (httpOnly cookies)

## Prerequisites
- Node 18+
- Neon PostgreSQL database

## Setup
1) Clone and install
```bash
cd web
npm install
```

2) Environment variables: create `web/.env.local`
```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST/db?sslmode=require"
JWT_SECRET="<32+ char random secret>"
APP_URL="http://localhost:3000"
```
If you shared your Neon URL, it’s already written to `.env.local`. We also wrote a secure `JWT_SECRET` and set `APP_URL`.

3) Generate and push schema
```bash
npx drizzle-kit generate
npx drizzle-kit push
```

4) Seed example content (optional)
```bash
npm run seed
```
This adds a featured, approved article to render on the homepage.

5) Run dev server
```bash
npm run dev
```
Visit `http://localhost:3000`.

## Scripts
- `npm run dev` – Start Next.js dev server
- `npm run build` – Production build
- `npm start` – Start production server
- `npm run lint` – Run ESLint
- `npm run db:generate` – Generate Drizzle SQL from schema
- `npm run db:push` – Apply schema to database
- `npm run db:studio` – Open Drizzle Studio
- `npm run seed` – Seed sample article (loads `.env.local`)

## Database Schema (Drizzle)
- `users` (id, email, name, password_hash, role [admin|journalist], created_at)
- `sessions` (id, user_id, jti, expires_at, created_at)
- `articles` (id, title, slug, author_id, body, featured_image_url, published_at, is_approved, is_featured, created_at, updated_at)
- `article_tags` (id, article_id, tag)

Files:
- `db/schema.ts` – Table definitions
- `db/client.ts` – Neon Drizzle client
- `drizzle.config.ts` – Drizzle Kit config

## Authentication
- Passwords hashed via `bcrypt`
- Sessions via JWT stored in `session` httpOnly cookie
- Helpers: `lib/auth.ts` (hash/verify, sign/verify JWT), `lib/session.ts` (getCurrentUser/requireUser/requireRole)

API routes:
- `POST /api/auth/register` – Register user
- `POST /api/auth/login` – Login (sets cookie)
- `POST /api/auth/logout` – Logout (clears cookie)

## Articles API
- `GET /api/articles?limit&offset` – List articles
- `GET /api/articles/:id` – Get article by id
- `POST /api/articles/create` – Create (journalist+)
- `PUT /api/articles/:id` – Update (owner or admin)
- `DELETE /api/articles/:id` – Delete (admin)

## Admin API
- `GET /api/admin/pending` – List unapproved articles (admin)
- `POST /api/admin/pending` – Approve article (admin)
- `GET /api/admin/users` – List users (admin)
- `PUT /api/admin/users` – Change role (admin)
- `DELETE /api/admin/users` – Delete user (admin)

## Upload API
- `POST /api/upload` – Local dev upload to `public/uploads/` and returns a URL
- For production (S3), swap implementation in `app/api/upload/route.ts` and add S3 envs

## App Pages & Layout
- `app/layout.tsx` – Masthead, nav, footer
- `app/globals.css` – Typography, newspaper styles (masthead, rules, drop-cap)
- `app/page.tsx` – Homepage
  - Fetches approved articles; renders hero + card grid + sidebar
- `app/articles/[slug]/page.tsx` – Article detail (Markdown rendered with GFM)
- `app/sections/[section]/page.tsx` – Section fronts by tag (e.g., news, sports)
- `app/journalist/login/page.tsx` – Journalist login form (posts to `/api/auth/login`)
- `app/dashboard/page.tsx` – Dashboard landing (requires auth)
- `app/dashboard/articles/page.tsx` – List user’s articles
- `app/dashboard/articles/new/page.tsx` – Create article
- `app/dashboard/articles/[id]/page.tsx` – Edit article, upload featured image
- `app/dashboard/admin/page.tsx` – Admin: approvals + user management

## Middleware & Guards
- `middleware.ts` – Redirects unauthenticated users from `/dashboard/*` to login
- `lib/session.ts` – Server-side session and role guards

## Styling
- Color palette tailored for readability
- Headline serif, bylines, rules, drop-caps, two-column grid
- Responsive: grid on wide screens, single-column on mobile

## Navigation
- `components/NavBar.tsx` – Announcement, News (dropdown), Journalist Login (hidden unless journalist/admin)

## Typical Workflow
1) Admin registers and logs in
2) Journalist registers (admin promotes role), logs in
3) Journalist creates articles from `/dashboard/articles/new`
4) Admin approves via `/dashboard/admin`
5) Homepage renders approved stories (featured hero + cards)

## Environment & Deployment
- `.env.local` contains local secrets
- Ensure `JWT_SECRET` is 32+ chars
- Set `APP_URL` to deployed URL for server fetches in admin page
- Production image upload: move to S3 and secure keys

## Troubleshooting
- Missing `DATABASE_URL`: set in `.env.local` and re-run `drizzle-kit push`
- Build errors about types: run `npm run lint` and fix reported files
- Authentication not working: ensure cookies aren’t blocked and `JWT_SECRET` is set

## License
For educational purposes within your school.
