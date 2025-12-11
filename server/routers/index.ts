import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const appRouter = router({
  health: publicProcedure.query(() => {
    return { status: "ok", timestamp: new Date().toISOString() };
  }),
});

export type AppRouter = typeof appRouter;
