"use client";

import { useRouter } from "next/navigation";
import { TodoForm } from "@/components/TodoForm";
import { useTodos } from "@/app/contexts/TodoContext";
import type { TodoStatus } from "@/app/contexts/TodoContext";

export default function CreateTodoPage() {
  const router = useRouter();
  const { createTodo } = useTodos();

  const handleSubmit = async (values: {
    title: string;
    content: string;
    status: TodoStatus;
  }) => {
    await createTodo(values);
    router.push("/todos");
  };

  return (
    <main className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">TODO作成</h2>
        </div>
      </header>

      <TodoForm onSubmit={handleSubmit} submitLabel="作成する" />
    </main>
  );
}
