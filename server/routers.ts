import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getAllAnswers, upsertAnswer } from "./db";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Valentine's answers router
  answers: router({
    getAll: publicProcedure.query(async () => {
      return await getAllAnswers();
    }),
    
    upsert: publicProcedure
      .input(z.object({
        questionId: z.number(),
        answerBubu: z.string(),
        answerBby: z.string(),
      }))
      .mutation(async ({ input }) => {
        await upsertAnswer(input.questionId, input.answerBubu, input.answerBby);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
