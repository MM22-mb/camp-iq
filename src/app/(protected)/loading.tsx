/**
 * Loading state for protected pages
 *
 * Next.js automatically shows this while Server Components are loading.
 * Uses the Suspense boundary pattern.
 */
export default function Loading() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
