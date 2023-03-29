import { db } from "~/lib/db";
import { type NewTodo, todo } from "~/../db/schema"
import { desc, eq } from 'drizzle-orm/expressions';



export async function createTodo({ id, text, completed = false, user_id }: { id: string, text: string, completed?: boolean, user_id: string }) {
    console.log("createTodo", id, text, completed, user_id)
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

export async function deleteTodo({ id }: { id: string }) {
    return await db.delete(todo)
        .where(eq(todo.id, id));
}

export async function getAllTodos() {
    return await db.select().from(todo).orderBy(desc(todo.created_at));
}
