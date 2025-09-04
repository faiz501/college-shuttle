import Header from "@/components/header";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header role="student" />
      <main className="flex-1">{children}</main>
    </div>
  );
}
