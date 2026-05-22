export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-paper flex items-center justify-center px-6">
      <div className="text-center max-w-xs">
        <p className="font-serif text-5xl text-faded-brown mb-6">📷</p>
        <h1 className="font-serif text-2xl text-charcoal mb-3 font-normal">you're offline</h1>
        <p className="text-warm-gray text-sm leading-relaxed">
          ShuttrBooth needs a connection to load. Check your network and try again.
        </p>
      </div>
    </main>
  );
}
