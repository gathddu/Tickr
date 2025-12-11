import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";


export const users = mysqlTable ("users", {
  id: int ("id").autoincrement().primaryKey(),
  email: varchar ("email", { length: 320 }).notNull().unique(),
  name: varchar ("name", { length: 255 }),
  createdAt: timestamp ("created_at").defaultNow().notNull(),
});

export const tasks = mysqlTable ("tasks", {
  id: int ("id").autoincrement().primaryKey(),
  userId: int ("user_id").notNull(),
  title: varchar ("title", { length: 255 }).notNull(),
  description: text ("description"),
  status: mysqlEnum ("status", ["pending", "in_progress", "completed"]).default("pending").notNull(),
  priority: mysqlEnum ("priority", ["low", "medium", "high"]).default("medium").notNull(),
  dueDate: timestamp ("due_date"),
  createdAt: timestamp ("created_at").defaultNow().notNull(),
  updatedAt: timestamp ("updated_at").defaultNow().notNull(),
});

export const timeEntries = mysqlTable ("time_entries", {
  id: int ("id").autoincrement().primaryKey(),
  taskId: int ("task_id").notNull(),
  userId: int ("user_id").notNull(),
  startTime: timestamp ("start_time").notNull(),
  endTime: timestamp ("end_time"),
  duration: int ("duration"),
  createdAt: timestamp ("created_at").defaultNow().notNull(),
});