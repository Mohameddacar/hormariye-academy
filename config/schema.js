import { pgTable, integer, varchar, boolean, jsonb, text, timestamp, decimal } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  SubscriptionId: varchar("SubscriptionId", { length: 128 }),
  subscriptionPlan: varchar("subscriptionPlan", { length: 32 }).default("free"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const coursesTable = pgTable("courses", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  cid: varchar("cid", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  description: text("description"),
  noOfChapters: integer("noOfChapters").notNull().default(1),
  includeVideo: boolean("includeVideo").notNull().default(false),
  level: varchar("level", { length: 32 }).notNull(),
  category: varchar("category", { length: 128 }),
  courseJson: jsonb("courseJson"),
  userEmail: varchar("userEmail", { length: 255 }).references(() => usersTable.email),
  isPublished: boolean("isPublished").default(true),
  bannerImageUrl: varchar("bannerImageUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const enrollmentsTable = pgTable("enrollments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("userId").references(() => usersTable.id),
  courseId: integer("courseId").references(() => coursesTable.id, { onDelete: 'cascade' }),
  enrolledAt: timestamp("enrolledAt").defaultNow(),
  progress: decimal("progress", { precision: 5, scale: 2 }).default("0.00"),
  completedChapters: jsonb("completedChapters").default([]),
  isCompleted: boolean("isCompleted").default(false),
});

export const progressTable = pgTable("progress", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("userId").references(() => usersTable.id),
  courseId: integer("courseId").references(() => coursesTable.id, { onDelete: 'cascade' }),
  chapterId: varchar("chapterId", { length: 64 }),
  isCompleted: boolean("isCompleted").default(false),
  completedAt: timestamp("completedAt"),
  timeSpent: integer("timeSpent").default(0), // in minutes
});

export const subscriptionsTable = pgTable("subscriptions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("userId").references(() => usersTable.id),
  plan: varchar("plan", { length: 32 }).notNull(),
  status: varchar("status", { length: 32 }).notNull(), // active, cancelled, expired
  price: decimal("price", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("USD"),
  startDate: timestamp("startDate").defaultNow(),
  endDate: timestamp("endDate"),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow(),
});
