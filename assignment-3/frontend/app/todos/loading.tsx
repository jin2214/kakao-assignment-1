export default function Loading() {
  return (
    <div className="w-full max-w-md mx-auto px-4 py-10 space-y-2">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-12 bg-gray-100 rounded-2xl animate-pulse" />
      ))}
    </div>
  );
}
