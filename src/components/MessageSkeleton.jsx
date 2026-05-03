const MessageSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex items-start gap-3 mb-4">
      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
    <div className="h-20 bg-gray-200 rounded-lg mb-2"></div>
  </div>
);

export default MessageSkeleton;

