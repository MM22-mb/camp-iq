/**
 * Protected Layout (Route Group)
 *
 * This is a "route group" — the (protected) folder name doesn't appear in the URL.
 * All pages inside this folder share this layout and are authenticated.
 *
 * WHY route groups? They let you share a layout across multiple routes
 * without affecting the URL structure. So /dashboard, /profile, /trips
 * all get the same header and auth check without needing "/protected" in the URL.
 */
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, email")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-background">
      <Header
        userName={profile?.name || null}
        userEmail={profile?.email || user.email || ""}
      />
      <main className="container mx-auto max-w-7xl px-4 py-6">
        {children}
      </main>
    </div>
  );
}
