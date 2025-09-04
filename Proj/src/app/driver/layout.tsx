import Header from "@/components/header";

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header role="driver" />
      <main className="flex-1">{children}</main>
    </div>
  );
}
