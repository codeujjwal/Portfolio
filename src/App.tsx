import { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HeroSection from "./sections/HeroSection";
import SkillsSection from "./sections/SkillsSection";
import ProjectsSection from "./sections/ProjectsSection";
import ExperienceSection from "./sections/ExperienceSection";
import EducationSection from "./sections/EducationSection";
import ContactSection from "./sections/ContactSection";
import GlowCursor from "./components/GlowCursor";
import "./styles/animations.css";

function App() {
  useEffect(() => {
    document.title = "Ujjwal Sharma | Software Developer";

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop,
            behavior: "smooth",
          });
        }
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeIn");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("section").forEach((section) => {
      observer.observe(section);
    });

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.removeEventListener("click", function (e) {
          e.preventDefault();
        });
      });

      observer.disconnect();
    };
  }, []);

  return (
    <div className="font-sans bg-gray-900">
      {window.innerWidth > 800 && <GlowCursor />}
      <Header />
      <main>
        <HeroSection />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
        <EducationSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
