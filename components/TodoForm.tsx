"use client";

import { FormEvent, useState } from "react";
import type { TodoStatus } from "@/app/contexts/TodoContext";

type Props = {
  initialValues?: {
    title: string;
    content: string;
    status: TodoStatus;
  };
  onSubmit: (values: {
    title: string;
    content: string;
    status: TodoStatus;
  }) => Promise<void> | void;
  submitLabel: string;
};

export function TodoForm({ initialValues, onSubmit, submitLabel }: Props) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [content, setContent] = useState(initialValues?.content ?? "");
  const [status, setStatus] = useState<TodoStatus>(
    initialValues?.status ?? "NOT_STARTED"
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("タイトルは必須です。");
      return;
    }
    if (title.length > 50) {
      setError("タイトルは50文字以内です。");
      return;
    }
    if (!content.trim()) {
      setError("内容は必須です。");
      return;
    }
    if (content.length > 100) {
      setError("内容は100文字以内です。");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({ title, content, status });
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("送信に失敗しました。");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
      {error && (
        <p className="text-sm text-red-500 mb-3 bg-red-50 border border-red-100 rounded px-3 py-2">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 text-sm font-medium text-slate-700">
            タイトル
          </label>
          <input
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={50}
          />
          <p className="text-xs text-slate-400 text-right mt-1">
            {title.length}/50文字
          </p>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-slate-700">
            内容
          </label>
          <textarea
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={100}
            rows={4}
          />
          <p className="text-xs text-slate-400 text-right mt-1">
            {content.length}/100文字
          </p>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-slate-700">
            ステータス
          </label>
          <select
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={status}
            onChange={(e) => setStatus(e.target.value as TodoStatus)}
          >
            <option value="NOT_STARTED">未完了</option>
            <option value="IN_PROGRESS">途中</option>
            <option value="COMPLETED">完了</option>
          </select>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-medium shadow-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {isSubmitting ? "送信中..." : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
