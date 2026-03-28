export default function ProductSkeleton() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-square bg-white/10" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-white/10 rounded w-1/3" />
        <div className="h-4 bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-white/10 rounded w-1/2" />
        <div className="flex justify-between items-center">
          <div className="h-6 bg-white/10 rounded w-1/4" />
          <div className="w-9 h-9 bg-white/10 rounded-xl" />
        </div>
      </div>
    </div>
  );
}