import { router, publicProcedure } from "../trpc";
import { tasksRouter } from "./tasks";

export const appRouter = router({
  health: publicProcedure.query(() => {
    return { status: "ok", timestamp: new Date().toISOString() };
  }),
  tasks: tasksRouter,
});

export type AppRouter = typeof appRouter;
