import Link from "next/link";
import { getTodoById } from "@/app/actions";
import EditTodoForm from "./EditTodoForm";

export default async function TodoDetailPage({
  params,
}: {
  params: Promise<{ todoId: string }>;
}) {
  const { todoId } = await params;
  const todo = await getTodoById(todoId);

  if (!todo) {
    return <div className="text-center py-20 text-gray-400">할 일을 찾을 수 없습니다.</div>;
  }

  return (
    <main className="max-w-md mx-auto px-4 py-10">
      <Link href="/todos" className="text-sm text-gray-400 hover:text-gray-600">
        ← 목록으로
      </Link>
      <h1 className="text-xl font-bold text-gray-900 mt-4 mb-6">할 일 수정</h1>
      <EditTodoForm todo={todo} />
    </main>
  );
}
