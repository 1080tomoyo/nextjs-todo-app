"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useTodos, type Todo } from "@/app/contexts/TodoContext";
import type { TodoStatus } from "@/app/contexts/TodoContext";

function getStatusLabel(status: TodoStatus) {
  switch (status) {
    case "NOT_STARTED":
      return "未完了";
    case "IN_PROGRESS":
      return "途中";
    case "COMPLETED":
      return "完了";
    default:
      return status;
  }
}

function getStatusClass(status: TodoStatus) {
  switch (status) {
    case "NOT_STARTED":
      return "bg-red-50 text-red-700 border-red-200";
    case "IN_PROGRESS":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

export default function TodoDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { deleteTodo } = useTodos();

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

  const handleDelete = async () => {
    if (!todo) return;
    if (!window.confirm("削除しますか？")) return;
    await deleteTodo(todo.id);
    router.push("/todos");
  };

  if (isLoading) return <p className="p-4">読み込み中...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!todo) return <p className="p-4">TODOが見つかりません。</p>;

  return (
    <main className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">TODO詳細</h2>
        </div>
        <Link href="/todos" className="text-xs text-blue-600 hover:underline">
          ← 一覧に戻る
        </Link>
      </header>

      <section className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold text-slate-900">
            {todo.title}
          </h3>
          <span
            className={`inline-flex items-center justify-center px-3 py-1 rounded-full border text-xs font-semibold ${getStatusClass(
              todo.status
            )}`}
          >
            {getStatusLabel(todo.status)}
          </span>
        </div>
        <p className="text-sm text-slate-700 whitespace-pre-wrap">
          {todo.content}
        </p>
      </section>

      <div className="flex gap-3 justify-end">
        <Link
          href={`/todos/${todo.id}/edit`}
          className="px-4 py-2 rounded-full border border-slate-200 text-sm text-slate-700 bg-white hover:bg-slate-50"
        >
          編集
        </Link>
        <button
          onClick={handleDelete}
          className="px-4 py-2 rounded-full bg-red-600 text-white text-sm font-medium hover:bg-red-700"
        >
          削除
        </button>
      </div>
    </main>
  );
}
