"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type TodoStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export type Todo = {
  id: number;
  title: string;
  content: string;
  status: TodoStatus;
  createdAt: string;
  updatedAt: string;
};

type FilterStatus = "ALL" | TodoStatus;
type SortOrder = "NEWEST" | "OLDEST";

type TodoContextValue = {
  todos: Todo[];
  filteredTodos: Todo[];
  filterStatus: FilterStatus;
  sortOrder: SortOrder;
  isLoading: boolean;
  error: string | null;
  fetchTodos: () => Promise<void>;
  createTodo: (data: {
    title: string;
    content: string;
    status: TodoStatus;
  }) => Promise<void>;
  updateTodo: (id: number, data: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  setFilterStatus: (status: FilterStatus) => void;
  setSortOrder: (order: SortOrder) => void;
};

const TodoContext = createContext<TodoContextValue | undefined>(undefined);

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");
  const [sortOrder, setSortOrder] = useState<SortOrder>("NEWEST");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/todos");
      if (!res.ok) throw new Error("TODOの取得に失敗しました");
      const data: Todo[] = await res.json();
      setTodos(data);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("送信に失敗しました。");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTodo = useCallback(
    async (data: { title: string; content: string; status: TodoStatus }) => {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "TODOの作成に失敗しました");
      }
      await fetchTodos();
    },
    [fetchTodos]
  );

  const updateTodo = useCallback(
    async (id: number, data: Partial<Todo>) => {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "TODOの更新に失敗しました");
      }
      await fetchTodos();
    },
    [fetchTodos]
  );

  const deleteTodo = useCallback(
    async (id: number) => {
      const res = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "TODOの削除に失敗しました");
      }
      await fetchTodos();
    },
    [fetchTodos]
  );

  const filteredTodos = useMemo(() => {
    return todos
      .filter((todo) =>
        filterStatus === "ALL" ? true : todo.status === filterStatus
      )
      .sort((a, b) => {
        const tA = new Date(a.createdAt).getTime();
        const tB = new Date(b.createdAt).getTime();
        if (sortOrder === "NEWEST") return tB - tA;
        return tA - tB;
      });
  }, [todos, filterStatus, sortOrder]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const value: TodoContextValue = {
    todos,
    filteredTodos,
    filterStatus,
    sortOrder,
    isLoading,
    error,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    setFilterStatus,
    setSortOrder,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export function useTodos() {
  const ctx = useContext(TodoContext);
  if (!ctx) {
    throw new Error("useTodos は TodoProvider の中で使ってください");
  }
  return ctx;
}
