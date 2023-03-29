import type { InferModel } from "drizzle-orm";
import { boolean, text, timestamp, varchar } from "drizzle-orm/mysql-core/columns";
import { mysqlTable } from "drizzle-orm/mysql-core/table";

export const todo = mysqlTable(
    "todo",
    {
        id: varchar("id", { length: 255}).primaryKey().notNull(),
        user_id: varchar("userId", { length: 191 }).notNull(),
        text: text("text").notNull(),
        created_at: timestamp("createdAt").notNull().defaultNow().onUpdateNow(),
        updated_at: timestamp("updatedAt").notNull().defaultNow().onUpdateNow(),
        completed: boolean('false'),
    }
);

export type Todo = InferModel<typeof todo>; // return type when queried
export type NewTodo = InferModel<typeof todo>;
