import { GridBackground } from "@/components/landing/GridBackground";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-obsidian relative flex items-center justify-center p-6">
      <GridBackground />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
