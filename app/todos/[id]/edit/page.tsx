"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TodoForm } from "@/components/TodoForm";
import { useTodos, type Todo } from "@/app/contexts/TodoContext";
import type { TodoStatus } from "@/app/contexts/TodoContext";
import Link from "next/link";

export default function EditTodoPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { updateTodo } = useTodos();

  const [todo, setTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/todos/${params.id}`);
        if (!res.ok) throw new Error("TODOの取得に失敗しました。");
        const data: Todo = await res.json();
        setTodo(data);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("エラーが発生しました。");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodo();
  }, [params.id]);

  const handleSubmit = async (values: {
    title: string;
    content: string;
    status: TodoStatus;
  }) => {
    if (!todo) return;
    await updateTodo(todo.id, values);
    router.push(`/todos/${todo.id}`);
  };

  if (isLoading) return <p className="p-4">読み込み中...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!todo) return <p className="p-4">TODOが見つかりません。</p>;

  return (
    <main className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">TODO編集</h2>
        </div>
        <Link
          href={`/todos/${todo.id}`}
          className="text-xs text-blue-600 hover:underline"
        >
          ← 詳細に戻る
        </Link>
      </header>

      <TodoForm
        initialValues={{
          title: todo.title,
          content: todo.content,
          status: todo.status as TodoStatus,
        }}
        onSubmit={handleSubmit}
        submitLabel="保存する"
      />
    </main>
  );
}
