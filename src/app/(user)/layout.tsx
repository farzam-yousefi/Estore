import "../globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ReactNode } from "react";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header>
        <Navigation />
      </header>
      <main className="w-full">{children}</main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
