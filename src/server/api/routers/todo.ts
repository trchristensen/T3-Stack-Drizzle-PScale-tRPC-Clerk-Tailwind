import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { createTodo, deleteTodo, getAllTodos } from "~/server/models/todo.server";

export const todoRouter = createTRPCRouter({

  create: publicProcedure
    .input(z.object({
      id: z.string().nonempty(),
      userId: z.string().nonempty(),
      text: z.string().nonempty(),
      completed: z.boolean().default(false)
    }))
    .mutation(async ({ input }) => {
      return await createTodo({
        id: input.id || createId(),
        user_id: createId(),
        text: input.text,
        completed: input.completed || false,
        created_at: new Date(),
        updated_at: new Date()
      })
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await deleteTodo({
        id: input.id
      })
    }),

  getAll: publicProcedure
    .query(async () => {
      return await getAllTodos()
    })
})
