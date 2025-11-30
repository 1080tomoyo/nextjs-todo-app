"use client";

import Link from "next/link";
import { useTodos } from "../contexts/TodoContext";
import type { TodoStatus } from "../contexts/TodoContext";

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

export default function TodosPage() {
  const {
    filteredTodos,
    filterStatus,
    sortOrder,
    isLoading,
    error,
    setFilterStatus,
    setSortOrder,
  } = useTodos();

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">TODO一覧</h2>
        </div>
        <Link
          href="/todos/create"
          className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-medium shadow-sm hover:bg-blue-700 transition"
        >
          ＋ TODO作成
        </Link>
      </header>

      <section className="flex flex-col sm:flex-row gap-3 mb-4">
        <select
          className="border rounded-full px-3 py-2 text-sm bg-white shadow-sm"
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value as typeof filterStatus)
          }
        >
          <option value="ALL">すべて</option>
          <option value="NOT_STARTED">未完了</option>
          <option value="IN_PROGRESS">途中</option>
          <option value="COMPLETED">完了</option>
        </select>

        <select
          className="border rounded-full px-3 py-2 text-sm bg-white shadow-sm"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
        >
          <option value="NEWEST">新しい順</option>
          <option value="OLDEST">古い順</option>
        </select>
      </section>

      {isLoading && <p className="text-sm text-slate-500">読み込み中...</p>}
      {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

      <ul className="space-y-3 mt-4">
        {filteredTodos.map((todo) => (
          <li key={todo.id}>
            <Link
              href={`/todos/${todo.id}`}
              className="block bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm hover:shadow-md hover:-translate-y-[1px] transition transform"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-900 line-clamp-1">
                    {todo.title}
                  </p>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                    {todo.content}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center justify-center px-3 py-1 rounded-full border text-xs font-semibold whitespace-nowrap ${getStatusClass(
                    todo.status
                  )}`}
                >
                  {getStatusLabel(todo.status)}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {!isLoading && filteredTodos.length === 0 && (
        <p className="text-sm text-slate-500 mt-6">
          TODOがありません。「＋ TODO作成」から追加してください。
        </p>
      )}
    </main>
  );
}
