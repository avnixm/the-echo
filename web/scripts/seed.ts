import 'dotenv/config';
import { db } from "@/db/client";
import { articles, articleTags, users } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { eq } from "drizzle-orm";

async function main() {
  // Ensure a default admin exists (username: echoAdmin, email: echoAdmin@echo.local)
  const adminEmail = "echoAdmin@echo.local";
  const adminName = "echoAdmin";
  const defaultPassword = "TfQYHh2ykPP1ew$EpCgg";
  const existingAdmin = await db.query.users.findFirst({ where: eq(users.email, adminEmail) });
  let admin = existingAdmin;
  if (!admin) {
    const passwordHash = await hashPassword(defaultPassword);
    const [inserted] = await db.insert(users).values({
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: "admin",
      verified: true,
    }).returning();
    admin = inserted;
    console.log("Created admin user:", adminEmail, "username=echoAdmin");
  } else {
    // Update existing admin to ensure password/role/verified are correct
    const passwordHash = await hashPassword(defaultPassword);
    await db.update(users).set({ name: adminName, role: "admin", verified: true, passwordHash }).where(eq(users.email, adminEmail));
    console.log("Updated admin user password and role for:", adminEmail);
  }

  // Ensure a sample approved article exists
  const title = "Corruption in Local Government";
  const slug = `corruption-in-local-government`;
  const existingArticle = await db.query.articles.findFirst({ where: eq(articles.slug, slug) });
  if (!existingArticle) {
    const body = `A deep-dive into systemic corruption in local governance and the path to reform.`;
    const [row] = await db.insert(articles).values({
      title,
      slug,
      body,
      authorId: admin!.id,
      isFeatured: true,
      publishedAt: new Date(),
    }).returning();
    await db.insert(articleTags).values([
      { articleId: row.id, tag: "news" },
      { articleId: row.id, tag: "politics" },
    ]);
    console.log("Seeded approved article:", slug);
  }

  console.log("Seed complete");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

