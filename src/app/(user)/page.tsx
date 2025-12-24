import { Metadata } from "next";

 export const metadata: Metadata = {
  title: 'Home',
};
export default async function Home() {
      return (
      <div className="grid grid-cols-2 gap-6">
         {/* HERO */}
      <section className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to Store 🛒
        </h1>

        <p className="mt-4 text-muted-foreground max-w-xl">
          A modern e-commerce platform built with Next.js, MongoDB,
          and secure authentication.
        </p>
      </section>
      </div>
    );
 
}
