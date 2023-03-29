import { type Todo } from "db/schema";
import { useState } from "react";
import { api } from "~/utils/api";

const Todo = () => {
  const ctx = api.useContext();

  const createTodo = api.todo.create.useMutation({
    onSuccess: (data) => {
      setText("");
      console.log("data", data);
    },
    onMutate: async (variables) => {
      console.log("variables", variables);

      await ctx.todo.getAll.cancel();
      ctx.todo.getAll.setData(
        undefined,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unsafe-return
        (old) => [variables, ...old]
      );
    },
  });

  const deleteTodo = api.todo.delete.useMutation();

  const { data: todos, error, isLoading } = api.todo.getAll.useQuery();

  const [text, setText] = useState("");

  function handleAddTodo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const variables = {
      text,
      completed: false,
      userId: "1",
    };
    createTodo.mutate(variables);
  }

  function handleDeleteTodo(id: string) {
    deleteTodo.mutate({
      id,
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleAddTodo}>
        <input
          className="w-full max-w-md rounded-lg border-purple-200 bg-white/20 px-4 py-2"
          type="text"
          placeholder="Add a todo..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </form>

      <div className="grid w-full grid-cols-1 gap-4">
        {todos &&
          todos.map((todo) => {
            return (
              <div
                className="flex w-full max-w-md items-center justify-between rounded-lg border-purple-200 bg-white/20 px-4 py-2"
                key={todo.id}
              >
                <span>{todo.text}</span>
                <button onClick={() => handleDeleteTodo(todo.id)}>x</button>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Todo;
