/**
 * Profile Page
 *
 * Server Component that fetches the profile and passes it to the client form.
 */
import { getProfile } from "@/lib/actions/profile";
import { ProfileForm } from "@/components/profile/profile-form";

export default async function ProfilePage() {
  const profile = await getProfile();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <ProfileForm profile={profile} />
    </div>
  );
}
