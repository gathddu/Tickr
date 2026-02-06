import { z } from "zod";
import { router, publicProcedure } from "../trpc";

// in-memory storage for now
let tasks: {
    id: number;
    title: string;
    description: string | null;
    status: "pending" | "in_progress" | "completed";
    priority: "low" | "medium" | "high";
    createdAt: Date;
}[] = [];

let nextId = 1;

export const tasksRouter = router({
    
    list: publicProcedure.query(() => {
        return tasks;
    }),

    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input }) => {
            return tasks.find((t) => t.id === input.id) || null;
        }),

    create: publicProcedure
        .input(
            z.object({
                title: z.string().min(1),
                description: z.string().optional(),
                priority: z.enum(["low", "medium", "high"]).default("medium"),
            })
        )
        .mutation(({ input }) => {
            const task = {
                id: nextId++,
                title: input.title,
                description: input.description || null,
                status: "pending" as const,
                priority: input.priority,
                createdAt: new Date(),
            };
            tasks.push(task);
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
        .mutation(({ input }) => {
            const task = tasks.find((t) => t.id === input.id);
            if (!task) throw new Error("Task not found");

            if (input.title) task.title = input.title;
            if (input.description !== undefined) task.description = input.description;
            if (input.status) task.status = input.status;
            if (input.priority) task.priority = input.priority;

            return task;
        }),

    delete: publicProcedure
        .input(z.object({ id: z.number() }))
        .mutation(({ input }) => {
            const index = tasks.findIndex((t) => t.id === input.id);
            if (index === -1) throw new Error("Task not found");
            tasks.splice(index, 1);
            return { success: true };
        }),
});
