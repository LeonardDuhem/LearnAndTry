import Sidebar from "@/components/Sidebar";
import StoreInitializer from "@/components/StoreInitializer";
import { getSubjects } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const [{ data: { user } }, subjects] = await Promise.all([
    supabase.auth.getUser(),
    getSubjects(),
  ]);

  return (
    <div className="flex min-h-screen relative z-10">
      {/* Initialise le store Zustand avec les données du serveur */}
      <StoreInitializer subjects={subjects} />
      <Sidebar subjects={subjects} userEmail={user?.email ?? null} />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}