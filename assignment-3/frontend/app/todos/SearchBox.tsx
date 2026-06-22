"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBox({ currentSearch }: { currentSearch: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(currentSearch);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      router.push(`/todos?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timer);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="검색"
      className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 outline-none focus:border-gray-500 mb-4"
    />
  );
}
