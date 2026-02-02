"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Define routes where we don't want the global Navbar/Footer
  // Dashboards usually have their own sidebars and headers
  const isDashboard =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/student") ||
    pathname.startsWith("/tutor");

  // Auth pages usually have a specialized layout
  const isAuth = pathname.startsWith("/auth");

  const hideFooter = isDashboard || isAuth;
  const hideNavbar = isAuth; // Keep navbar on dashboards for now

  return (
    <>
      <Toaster richColors position="top-right" />
      {!hideNavbar && <Navbar />}
      <div className={isDashboard ? "" : "min-h-[80vh]"}>{children}</div>
      {!hideFooter && <Footer />}
    </>
  );
}
