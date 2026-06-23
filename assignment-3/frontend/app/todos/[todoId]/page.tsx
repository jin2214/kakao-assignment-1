import Link from "next/link";
import { getTodoById } from "@/app/actions";
import EditTodoForm from "./EditTodoForm";
import { stringToDate, formatDateLabel } from "@/app/todos/dateUtils";

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
    <main className="w-full max-w-md mx-auto px-4 py-10">
      <Link href={`/todos?date=${todo.date}`} className="text-sm text-gray-400 hover:text-gray-600">
        ← 목록으로
      </Link>
      <h1 className="text-xl font-bold text-gray-900 mt-4 mb-1">할 일 수정</h1>
      <p className="text-sm text-gray-400 mb-6">{formatDateLabel(stringToDate(todo.date))}</p>
      <EditTodoForm todo={todo} />
    </main>
  );
}
