import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { TechStack } from "@/components/sections/TechStack";
import { Team } from "@/components/sections/Team";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";

/**
 * Single-page-scroll root.
 *
 * Section order (Phase 2.2 + 2.3 combined — final):
 * Hero → Services → Process → SelectedWork → TechStack → Team → FAQ → Contact
 *
 * Anchor targets: #hero, #services, #process, #work, #tech, #team, #faq, #contact.
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <Hero />
        <Services />
        <Process />
        <SelectedWork />
        <TechStack />
        <Team />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
