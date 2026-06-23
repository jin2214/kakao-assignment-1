import Link from "next/link";
import NewTodoForm from "./NewTodoForm";
import { getToday, stringToDate, dateToString, formatDateLabel, isValidDateString } from "@/app/todos/dateUtils";

export default async function NewTodoPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const currentDate = date && isValidDateString(date) ? stringToDate(date) : getToday();
  const dateStr = dateToString(currentDate);

  return (
    <main className="w-full max-w-md mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-1">
        <Link href={`/todos?date=${dateStr}`} className="text-gray-400 hover:text-gray-600 text-sm">
          ← 목록으로
        </Link>
        <h1 className="text-xl font-bold text-gray-900">할 일 추가</h1>
      </div>
      <p className="text-sm text-gray-400 mb-6">{formatDateLabel(currentDate)}에 추가합니다</p>
      <NewTodoForm date={dateStr} />
    </main>
  );
}
