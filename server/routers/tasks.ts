import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { db } from "../db";
import { tasks } from "../db/schema";
import { eq } from "drizzle-orm";

export const tasksRouter = router({
  list: publicProcedure.query(async () => {
    return await db.select().from(tasks);
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const [task] = await db
        .select()
        .from(tasks)
        .where(eq(tasks.id, input.id));
      return task || null;
    }),

  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        priority: z.enum(["low", "medium", "high"]).default("medium"),
      })
    )
    .mutation(async ({ input }) => {
      const [task] = await db
        .insert(tasks)
        .values({
          title: input.title,
          description: input.description || null,
          priority: input.priority,
          status: "pending",
        })
        .returning();
      
      return task;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        status: z.enum(["pending", "in_progress", "completed"]).optional(),
        priority: z.enum(["low", "medium", "high"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      
      const [updated] = await db
        .update(tasks)
        .set({
          ...updates,
          updated_at: new Date(),
        })
        .where(eq(tasks.id, id))
        .returning();
      
      if (!updated) {
        throw new Error("Task not found");
      }
      
      return updated;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const deleted = await db
        .delete(tasks)
        .where(eq(tasks.id, input.id))
        .returning();
      
      if (deleted.length === 0) {
        throw new Error("Task not found");
      }
      
      return { success: true };
    }),
});
