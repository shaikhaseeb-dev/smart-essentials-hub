export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-ink-ghost/60 overflow-hidden">
      <div className="aspect-square skeleton" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 rounded-lg w-3/4" />
        <div className="skeleton h-3 rounded-lg w-full" />
        <div className="skeleton h-3 rounded-lg w-5/6" />
        <div className="flex gap-1 pt-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton w-3.5 h-3.5 rounded" />
          ))}
        </div>
        <div className="skeleton h-6 rounded-lg w-1/3 mt-2" />
        <div className="skeleton h-10 rounded-xl w-full mt-3" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
      {[...Array(count)].map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}
