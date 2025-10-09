export default function PendingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow p-8 space-y-4">
        <h1 className="text-2xl font-semibold">Your request is pending approval</h1>
        <p className="text-gray-600">
          Thanks! Your account request was received. We’ll notify you when it’s approved.
        </p>
        <a href="/login" className="inline-block rounded-xl bg-black text-white px-4 py-2">Back to sign in</a>
      </div>
    </main>
  );
}
