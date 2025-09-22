import { pgTable, serial, varchar, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	name: varchar("name", { length: 255 }).notNull(),
	passwordHash: varchar("password_hash", { length: 255 }).notNull(),
	role: varchar("role", { length: 32 }).notNull().default("journalist"), // admin | journalist
	verified: boolean("verified").notNull().default(false),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
	id: serial("id").primaryKey(),
	userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
	jti: varchar("jti", { length: 255 }).notNull().unique(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const articles = pgTable("articles", {
	id: serial("id").primaryKey(),
	title: varchar("title", { length: 300 }).notNull(),
	slug: varchar("slug", { length: 320 }).notNull().unique(),
	authorId: integer("author_id").notNull().references(() => users.id, { onDelete: "set null" }),
	body: text("body").notNull(),
	featuredImageUrl: varchar("featured_image_url", { length: 1024 }),
	publishedAt: timestamp("published_at"),
	status: varchar("status", { length: 16 }).notNull().default("pending"), // pending | approved | rejected
	isFeatured: boolean("is_featured").notNull().default(false),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const articleTags = pgTable("article_tags", {
	id: serial("id").primaryKey(),
	articleId: integer("article_id").notNull().references(() => articles.id, { onDelete: "cascade" }),
	tag: varchar("tag", { length: 64 }).notNull(),
});

export const otpCodes = pgTable("otp_codes", {
	id: serial("id").primaryKey(),
	userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
	otpToken: varchar("otp_token", { length: 255 }).notNull().unique(),
	codeHash: varchar("code_hash", { length: 255 }).notNull(),
	purpose: varchar("purpose", { length: 32 }).notNull(), // login | register
	expiresAt: timestamp("expires_at").notNull(),
	consumed: boolean("consumed").notNull().default(false),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
	articles: many(articles),
}));

export const articlesRelations = relations(articles, ({ many }) => ({
	tags: many(articleTags),
}));


