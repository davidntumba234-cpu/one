import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";

const NEURONOVA_LOGO = "https://customer-assets.emergentagent.com/job_029cb03c-63b5-427f-af8c-afed8e65308a/artifacts/1rt013g6_file_00000000871c71f79e6e1c736e9fbdf8.png";

const navLinks = [
  { name: "Accueil", href: "#hero" },
  { name: "Services", href: "#services" },
  { name: "Histoire", href: "#histoire" },
  { name: "Pays", href: "#pays" },
  { name: "Fondateurs", href: "#fondateurs" },
  { name: "Contact", href: "#contact" },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
      
      // Update active section
      const sections = navLinks.map(link => link.href.replace('#', ''));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? "py-3 glass" 
            : "py-6 bg-transparent"
        }`}
        data-testid="main-navigation"
      >
        <div className="container-custom">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button 
              onClick={() => scrollToSection('#hero')} 
              className="flex items-center gap-3 group"
              data-testid="logo-link"
            >
              <div className="relative">
                <img 
                  src={NEURONOVA_LOGO} 
                  alt="Neuronova Logo" 
                  className="w-10 h-10 md:w-12 md:h-12 drop-shadow-lg"
                />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-lg md:text-xl text-white block leading-none">Neuronova</span>
                <span className="text-xs text-primary tracking-wider">Tech. Intelligence. Afrique.</span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className={`nav-link ${activeSection === link.href.replace('#', '') ? 'active' : ''}`}
                  data-testid={`nav-link-${link.name.toLowerCase()}`}
                >
                  {link.name}
                </button>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <Button 
                onClick={() => scrollToSection('#contact')}
                className="btn-primary h-12 px-8"
                data-testid="nav-contact-btn"
              >
                Nous Contacter
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white"
              data-testid="mobile-menu-toggle"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
            data-testid="mobile-menu"
          >
            <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-slate-900 border-l border-white/10 p-8 pt-24"
            >
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => scrollToSection(link.href)}
                    className={`text-left text-xl font-medium py-2 transition-colors ${
                      activeSection === link.href.replace('#', '')
                        ? "text-primary"
                        : "text-slate-400 hover:text-white"
                    }`}
                    data-testid={`mobile-nav-link-${link.name.toLowerCase()}`}
                  >
                    {link.name}
                  </button>
                ))}
                <Button 
                  onClick={() => scrollToSection('#contact')}
                  className="btn-primary mt-4"
                  data-testid="mobile-contact-btn"
                >
                  Nous Contacter
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
