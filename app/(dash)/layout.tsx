import { AuthManager } from "@/lib/auth-manager";
import { DashboardClientWrapper } from "@/components/dashboard-client-wrapper";

export default async function DashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await AuthManager.getCurrentUser();
  return (
    <DashboardClientWrapper user={user}>
      {children}
    </DashboardClientWrapper>
  );
}
