"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import type { Todo } from "@/app/actions";

export default function TodoItem({ todo }: { todo: Todo }) {
  const router = useRouter();
  const [isToggling, setIsToggling] = useState(false);

  async function handleToggle() {
    setIsToggling(true);
    try {
      await axios.put("/api/todos", { id: todo.id, completed: !todo.completed });
      router.refresh();
    } catch {
      alert("상태 변경에 실패했습니다");
    } finally {
      setIsToggling(false);
    }
  }

  async function handleDelete() {
    if (!confirm("정말 삭제할까요?")) return;
    try {
      await axios.delete(`/api/todos?id=${todo.id}`);
      router.refresh();
    } catch {
      alert("삭제에 실패했습니다");
    }
  }

  return (
    <li className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl border border-gray-200">
      <button
        onClick={handleToggle}
        disabled={isToggling}
        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${
          todo.completed ? "bg-gray-900 border-gray-900" : "border-gray-300"
        }`}
        aria-label={todo.completed ? "완료 취소" : "완료"}
      />
      <Link href={`/todos/${todo.id}`} className="flex-1">
        <span className={`text-sm ${todo.completed ? "line-through text-gray-300" : "text-gray-800"}`}>
          {todo.text}
        </span>
      </Link>
      <button onClick={handleDelete} className="text-gray-300 hover:text-gray-600 text-sm" aria-label="삭제">
        ✕
      </button>
    </li>
  );
}
