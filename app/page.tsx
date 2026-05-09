import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TechStack from "@/components/TechStack";
import About from "@/components/About";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import CalendlyBooking from "@/components/CalendlyBooking";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <TechStack />
      <About />
      <Services />
      <Portfolio />
      <Testimonials />
      <CalendlyBooking />
      <Contact />
      <Footer />
    </main>
  );
}
