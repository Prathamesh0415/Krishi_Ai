import Header1 from "@/components/mvpblocks/header-1";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header1 />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}