import { LinkButton } from "@/components/ui/link-button";

export default function TripNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="text-3xl font-bold mb-2">Trip Not Found</h1>
      <p className="text-muted-foreground mb-4">
        This trip doesn&apos;t exist or you don&apos;t have access to it.
      </p>
      <LinkButton href="/dashboard">Back to My Trips</LinkButton>
    </div>
  );
}
