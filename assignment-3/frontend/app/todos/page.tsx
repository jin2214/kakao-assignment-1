import Link from "next/link";
import { getTodos, getWeekTodos } from "@/app/actions";
import TodoItem from "./TodoItem";
import FilterTabs from "./FilterTabs";
import SearchBox from "./SearchBox";
import DateNav from "./DateNav";
import WeekView from "./WeekView";
import Stats from "./Stats";
import { getToday, stringToDate, dateToString, getMondayOfWeek, shiftDate, isValidDateString } from "./dateUtils";

export default async function TodosPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; search?: string; date?: string }>;
}) {
  const { filter, search, date } = await searchParams;

  const currentDate = date && isValidDateString(date) ? stringToDate(date) : getToday();
  const dateStr = dateToString(currentDate);
  const weekStart = getMondayOfWeek(currentDate);
  const weekStartStr = dateToString(weekStart);
  const weekEndStr = dateToString(shiftDate(weekStart, 6));

  const [todos, weekTodos] = await Promise.all([
    getTodos(filter, search, dateStr),
    getWeekTodos(weekStartStr, weekEndStr),
  ]);
  const dayTodos = weekTodos.filter((t) => t.date === dateStr);

  return (
    <main className="w-full max-w-md mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">할 일 목록</h1>
        <Link
          href={`/todos/new?date=${dateStr}`}
          className="bg-gray-900 text-white text-sm px-4 py-2 rounded-xl hover:bg-gray-700"
        >
          추가
        </Link>
      </div>

      <DateNav currentDate={currentDate} filter={filter} search={search} />
      <WeekView weekStart={weekStart} currentDate={currentDate} weekTodos={weekTodos} filter={filter} search={search} />
      <Stats dayTodos={dayTodos} />

      <FilterTabs currentFilter={filter ?? "all"} date={dateStr} search={search} />
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
