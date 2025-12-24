"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold">
          Something went wrong
        </h2>

        <p className="text-muted-foreground">
          {process.env.NODE_ENV === "development"
            ? error.message
            : "Please try again later."}
        </p>

        <button
          onClick={reset}
          className="underline text-sm"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
