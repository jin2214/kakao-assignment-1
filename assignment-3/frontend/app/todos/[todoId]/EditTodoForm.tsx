"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import type { Todo } from "@/app/actions";

export default function EditTodoForm({ todo }: { todo: Todo }) {
  const router = useRouter();
  const [text, setText] = useState(todo.text);
  const [error, setError] = useState(false);

  async function handleSave() {
    if (!text.trim()) {
      setError(true);
      return;
    }
    try {
      await axios.put("/api/todos", { id: todo.id, text: text.trim() });
      router.push(`/todos?date=${todo.date}`);
    } catch {
      alert("수정에 실패했습니다");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        value={text}
        maxLength={100}
        onChange={(e) => {
          setText(e.target.value);
          setError(false);
        }}
        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 outline-none focus:border-gray-500"
      />
      {error && <p className="text-xs text-gray-500">할 일을 입력해주세요.</p>}
      <button
        onClick={handleSave}
        className="bg-gray-900 text-white text-sm py-2.5 rounded-xl hover:bg-gray-700"
      >
        저장
      </button>
    </div>
  );
}
