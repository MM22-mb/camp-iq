/**
 * Profile Page
 *
 * Matches the Lovable app layout: user icon, heading, subtitle,
 * then profile form organized into cards.
 */
import { User } from "lucide-react";
import { getProfile } from "@/lib/actions/profile";
import { ProfileForm } from "@/components/profile/profile-form";

export default async function ProfilePage() {
  const profile = await getProfile();

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
          <User className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
        </div>
      </div>
      <p className="text-muted-foreground mb-6 ml-[52px]">
        Set your preferences for personalized trip planning
      </p>
      <ProfileForm profile={profile} />
    </div>
  );
}
