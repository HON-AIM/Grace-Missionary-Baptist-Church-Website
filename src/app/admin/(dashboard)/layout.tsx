import Sidebar from "@/components/admin/Sidebar";
import AuthWrapper from "@/components/admin/AuthWrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthWrapper>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-auto min-h-screen">
          <div className="p-4 lg:p-8 pt-16 lg:pt-8">{children}</div>
        </main>
      </div>
    </AuthWrapper>
  );
}
