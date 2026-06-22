"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function NewTodoForm() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [error, setError] = useState(false);

  async function handleAdd() {
    if (!text.trim()) {
      setError(true);
      return;
    }
    try {
      await axios.post("/api/todos", { text: text.trim() });
      router.push("/todos");
    } catch {
      alert("할 일 추가에 실패했습니다");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter") handleAdd();
  }

  return (
    <div className="flex flex-col gap-1">
      <input
        type="text"
        value={text}
        maxLength={100}
        placeholder="할 일"
        onChange={(e) => {
          setText(e.target.value);
          setError(false);
        }}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 bg-white outline-none focus:border-gray-500"
      />
      {error && <p className="text-xs text-gray-500 pl-1">할 일을 입력해주세요.</p>}
      <button
        onClick={handleAdd}
        className="mt-3 bg-gray-900 text-white text-sm py-2.5 rounded-xl hover:bg-gray-700"
      >
        추가
      </button>
    </div>
  );
}
