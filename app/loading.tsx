export default function Loading() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 space-y-6">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-blue-50 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-bold text-gray-900 font-outfit">
          Loading...
        </h2>
        <p className="text-gray-500 font-medium animate-pulse">
          Preparing your learning experience
        </p>
      </div>
    </div>
  );
}
