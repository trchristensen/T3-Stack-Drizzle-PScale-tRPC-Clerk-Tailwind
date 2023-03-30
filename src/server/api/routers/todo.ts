import { clerkClient } from "@clerk/nextjs/server";
import { createId } from "@paralleldrive/cuid2";
import { TRPCError } from "@trpc/server";
import { todo } from "db/schema";
import { z } from "zod";
import { db } from "~/lib/db";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { createTodo, deleteTodo, getAllTodos, getAllTodosByUserId, getTodo } from "~/server/models/todo.server";

export const todoRouter = createTRPCRouter({

  create: protectedProcedure
    .input(z.object({
      id: z.string().nonempty(),
      userId: z.string().nonempty(),
      text: z.string().nonempty(),
      completed: z.boolean().default(false)
    }))
    .mutation(async ({ input, ctx }) => {

      if (!ctx.userId) throw new TRPCError({ code: "UNAUTHORIZED" })

      return await createTodo({
        id: input.id || createId(),
        user_id: ctx.userId,
        text: input.text,
        completed: input.completed || false,
        created_at: new Date(),
        updated_at: new Date()
      })
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {

      // if no user_id in context, throw an error
      if (!ctx.userId) throw new TRPCError({ code: "UNAUTHORIZED" })

      const isAdmin = checkIfAdmin(ctx.userId);
      // look up todo in db to grab user_id
      const todo = await getTodo({ id: input.id })
      // if the todo's user_id doesn't match the user_id in the context or is not admin, throw an error
      if (todo[0]?.user_id !== ctx.userId && !isAdmin) throw new TRPCError({ code: "UNAUTHORIZED" })

      return await deleteTodo({
        id: input.id
      })
    }),

  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      const isAdmin = await checkIfAdmin(ctx.userId);

      if (isAdmin) return await getAllTodos();

      if(!ctx.userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      return await getAllTodosByUserId({ userId: ctx.userId })
    })
})

async function checkIfAdmin(userId: string): Promise<boolean> {
  const user = await clerkClient.users.getUser(userId)
  if (!user) return false;
  const userRoles = [...(user.privateMetadata?.roles as string[] ?? [])];
  return userRoles.includes("ADMIN")
}