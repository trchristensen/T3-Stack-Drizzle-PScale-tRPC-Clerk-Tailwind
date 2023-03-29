import { createId } from "@paralleldrive/cuid2";
import { NewTodo, type Todo } from "db/schema";
import { useState } from "react";
import { api } from "~/utils/api";

const Todo = () => {
  const ctx = api.useContext();

  const createTodo = api.todo.create.useMutation({
    onSuccess: () => {
      setText("");
    },
    onMutate: async (variables) => {
      await ctx.todo.getAll.cancel();
     ctx.todo.getAll.setData(void 0, (old: Todo[] | undefined) => {
      console.log('OLD', old)
       if (!old) {
         return [variables];
       } else {
         return [variables, ...old];
       }
     });
    },
  });

  const deleteTodo = api.todo.delete.useMutation({
    onMutate: async (variables) => {
      await ctx.todo.getAll.cancel();
      ctx.todo.getAll.setData(undefined, (old) =>
        old?.filter((todo) => todo.id !== variables.id)
      );
    },
  });

  const { data: todos } = api.todo.getAll.useQuery();

  const [text, setText] = useState("");

  function handleAddTodo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const id = createId();
    const variables = {
      id,
      text,
      completed: false,
      userId: "1",
    };
    createTodo.mutate(variables);
  }

  function handleDeleteTodo(id: string) {
    console.log("delete todo", id);
    deleteTodo.mutate(
      {
        id,
      },
      {
        onSuccess: (data) => {
          return console.log("DELETE SUCCESS", data);
        },
      }
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleAddTodo}>
        <input
          className="w-full text-xl max-w-md rounded-lg bg-white/20 px-4 py-2 outline-purple-200/20"
          type="text"
          placeholder="Add a todo..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </form>

      <div className="w-full flex flex-col gap-4 text-lg">
        {todos &&
          todos.map((todo) => {
            return (
              <div
                className="flex w-full max-w-md items-center justify-between rounded-lg border-purple-200 bg-white/20 px-4 py-2"
                key={todo.id}
              >
                <span>
                  {todo.text}
                
                </span>
                <button onClick={() => handleDeleteTodo(todo.id)}>x</button>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Todo;
