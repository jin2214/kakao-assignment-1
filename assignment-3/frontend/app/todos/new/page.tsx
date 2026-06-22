import Link from "next/link";
import NewTodoForm from "./NewTodoForm";

export default function NewTodoPage() {
  return (
    <main className="w-full max-w-md mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/todos" className="text-gray-400 hover:text-gray-600 text-sm">
          ← 목록으로
        </Link>
        <h1 className="text-xl font-bold text-gray-900">할 일 추가</h1>
      </div>
      <NewTodoForm />
    </main>
  );
}
