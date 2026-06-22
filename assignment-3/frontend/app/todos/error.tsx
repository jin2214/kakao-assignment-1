"use client";

export default function Error({ error }: { error: Error }) {
  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <div className="bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-6">
        <p className="font-medium">오류가 발생했습니다</p>
        <p className="text-sm mt-1 text-gray-500">{error.message}</p>
      </div>
    </div>
  );
}
