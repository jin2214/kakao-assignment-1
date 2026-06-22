import Link from "next/link";
import { getTodos } from "@/app/actions";
import TodoItem from "./TodoItem";
import FilterTabs from "./FilterTabs";
import SearchBox from "./SearchBox";

export default async function TodosPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; search?: string }>;
}) {
  const { filter, search } = await searchParams;
  const todos = await getTodos(filter, search);

  return (
    <main className="w-full max-w-md mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">할 일 목록</h1>
        <Link
          href="/todos/new"
          className="bg-gray-900 text-white text-sm px-4 py-2 rounded-xl hover:bg-gray-700"
        >
          추가
        </Link>
      </div>

      <FilterTabs currentFilter={filter ?? "all"} />
      <SearchBox currentSearch={search ?? ""} />

      {todos.length === 0 ? (
        <p className="text-center text-sm text-gray-300 py-10">할 일이 없어요.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      )}
    </main>
  );
}
