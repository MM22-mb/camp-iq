/**
 * Explore Page (Placeholder)
 *
 * This will eventually show community trips that users can browse and clone.
 * For the MVP, it's a simple coming-soon placeholder.
 */
import { Compass } from "lucide-react";

export default function ExplorePage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="rounded-full bg-green-50 p-4 mb-4">
        <Compass className="h-8 w-8 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold mb-2">Explore</h1>
      <p className="text-muted-foreground max-w-md">
        Browse trips created by other campers and get inspired for your next
        adventure. This feature is coming soon!
      </p>
    </div>
  );
}
