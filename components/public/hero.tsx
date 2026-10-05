import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 overflow-hidden">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Empowering Students Through Opportunity
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Join the Adeyinka Bakare Fellowship and unlock your potential
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="glass">
              Join the Community
            </Button>
            <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10 glass">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
