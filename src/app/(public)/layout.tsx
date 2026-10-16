import { BackToTop } from "@/components/public/back-to-top";
import { Footer } from "@/components/public/footer";
import { Navbar } from "@/components/public/navbar";
import { ScrollProgress } from "@/components/public/scroll-progress";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="pt-[72px]">
        {children}
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
