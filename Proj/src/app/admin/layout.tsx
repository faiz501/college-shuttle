import Header from "@/components/header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header role="admin" />
      <main className="flex-1">{children}</main>
    </div>
  );
}
