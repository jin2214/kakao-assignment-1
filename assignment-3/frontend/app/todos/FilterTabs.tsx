import Link from "next/link";

const TABS = [
  { label: "전체", value: "all" },
  { label: "진행 중", value: "active" },
  { label: "완료", value: "completed" },
];

export default function FilterTabs({ currentFilter }: { currentFilter: string }) {
  return (
    <div className="flex gap-1 bg-gray-200 rounded-xl p-1 mb-4">
      {TABS.map((tab) => (
        <Link
          key={tab.value}
          href={tab.value === "all" ? "/todos" : `/todos?filter=${tab.value}`}
          className={`flex-1 min-w-0 text-center py-1.5 text-sm whitespace-nowrap rounded-lg ${
            currentFilter === tab.value ? "bg-white text-gray-900 font-semibold" : "text-gray-400"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
