import { db } from "~/lib/db";
import { type NewTodo, todo } from "~/../db/schema"
import { desc, eq } from 'drizzle-orm/expressions';

export async function createTodo({ id, text, completed = false, user_id }: NewTodo) {
    const newTodo: NewTodo = {
        id,
        completed,
        text,
        user_id,
        created_at: new Date(),
        updated_at: new Date()
    }
    return await db.insert(todo).values(newTodo)
}

export async function getTodo({ id }: { id: string }) {
    return await db.select().from(todo).where(eq(todo.id, id));
}

export async function deleteTodo({ id }: { id: string }) {
    return await db.delete(todo)
        .where(eq(todo.id, id));
}

export async function getAllTodos() {
    return await db.select().from(todo).orderBy(desc(todo.created_at));
}

export async function getAllTodosByUserId({ userId }: { userId: string }) {
    return await db.select().from(todo).where(eq(todo.user_id, userId)).orderBy(desc(todo.created_at));
}
