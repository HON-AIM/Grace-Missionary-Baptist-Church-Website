import { AuthProvider } from "@/contexts/AuthContext";

export const metadata = {
  title: {
    default: "Admin Panel | GMBC",
    template: "%s | GMBC Admin",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-navy-900">{children}</div>
    </AuthProvider>
  );
}
