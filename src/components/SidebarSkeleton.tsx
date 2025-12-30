// Skeleton component
function SidebarSkeleton() {
  return (
    <div className="space-y-4 p-4 w-64">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="space-y-2">
          <div className="h-4 w-24 bg-gray-300 rounded animate-pulse" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-3 w-full bg-gray-200 rounded animate-pulse ml-2"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

