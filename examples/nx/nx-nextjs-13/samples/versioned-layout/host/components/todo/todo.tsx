import React, { FormEventHandler, useState } from 'react';
import { PlusIcon } from 'lucide-react';
import cn from 'clsx';

export type TodoData = {
  title: string;
  completed: boolean;
};

const INITIAL_TODOS: TodoData[] = [
  {
    title: 'Buy milk',
    completed: false,
  },
  {
    title: 'Buy eggs',
    completed: false,
  },
  {
    title: 'Buy bread',
    completed: false,
  },
];

/* eslint-disable-next-line */
export interface TodoProps {}

export function Todo(props: TodoProps) {
  const [todos, setTodos] = useState<TodoData[]>(INITIAL_TODOS);

  const addTodo = (newTodo: TodoData) => {
    if (newTodo.title && newTodo.title.trim()) {
      setTodos((t) => [...t, newTodo]);
    }
  };

  const removeTodo = (index: number) => {
    setTodos((t) => t.filter((todo, i) => i !== index));
  };

  const toggleTodo = (index: number) => {
    setTodos((t) =>
      t.map((todo, i) =>
        i === index ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries());

    addTodo({
      completed: false,
      title: (formValues['todo-title-input'] as string).trim(),
    });

    form.reset();
  };

  return (
    <div className="container mx-auto max-w-md mt-10">
      <h1 className="text-2xl font-semibold mb-4">Todo App</h1>
      <div className="flex">
        <form
          onSubmit={handleSubmit}
          className="flex border p-2 pl-4 rounded-lg items-center space-x-2 w-full"
        >
          <PlusIcon className="text-slate-500" />
          <input
            id="todo-title-input"
            name="todo-title-input"
            type="text"
            className="flex-1 h-full px-2 text-slate-700 placeholder-slate-400"
            placeholder="New todo title"
          />
          <button
            className="bg-slate-300 text-slate-700 p-2 rounded-lg min-w-[100px] flex justify-center items-center"
            type="submit"
          >
            Add
          </button>
        </form>
      </div>
      <ul className="mt-4 flex flex-col space-y-2">
        {todos.map((todo, index) => (
          <li
            key={index}
            className="flex justify-between items-center border p-2 pl-4 rounded-lg"
          >
            <div className="w-full flex items-center">
              <input
                id={`todo-check-${index}`}
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(index)}
                className="h-5 w-5 rounded border-gray-300"
              />
              <label
                className={cn('ml-2 w-full', {
                  'line-through': todo.completed,
                })}
                htmlFor={`todo-check-${index}`}
              >
                {todo.title}
              </label>
            </div>
            <button
              className="bg-red-300 text-red-950 p-2 rounded-lg min-w-[100px] flex justify-center items-center"
              onClick={() => removeTodo(index)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
