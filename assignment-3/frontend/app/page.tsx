import Link from "next/link";

export default function HomePage() {
  return (
    <main className="max-w-md mx-auto px-4 py-10 text-center">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Todo App</h1>
      <Link href="/todos" className="text-gray-700 underline">
        할 일 목록으로 이동
      </Link>
    </main>
  );
}
