import { Footer } from "@/components/public/footer";
import { Navbar } from "@/components/public/navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        {children}
      </main>
      <Footer />
    </>
  );
}
