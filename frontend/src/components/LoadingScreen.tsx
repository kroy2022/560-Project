export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-zinc-700 border-t-zinc-50 rounded-full animate-spin"></div>

        <p className="text-zinc-400 text-lg">Loading...</p>
      </div>
    </div>
  );
}
