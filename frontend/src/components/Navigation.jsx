import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Calendar } from "lucide-react";
import { Button } from "./ui/button";

const NEURONOVA_LOGO = "https://customer-assets.emergentagent.com/job_029cb03c-63b5-427f-af8c-afed8e65308a/artifacts/1rt013g6_file_00000000871c71f79e6e1c736e9fbdf8.png";

const navLinks = [
  { name: "Accueil", href: "#hero" },
  { name: "Services", href: "#services" },
  { name: "À propos", href: "#histoire" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Témoignages", href: "#testimonials" },
  { name: "FAQ", href: "#faq" },
  { name: "Contact", href: "#contact" },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Update active section
      const sections = navLinks.map(link => link.href.replace('#', ''));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
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
      {/* Main Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "py-2 bg-slate-950/95 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20" 
            : "py-4 bg-transparent"
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
              <motion.img 
                src={NEURONOVA_LOGO} 
                alt="Neuronova Logo" 
                className={`drop-shadow-lg transition-all duration-300 ${isScrolled ? 'w-10 h-10' : 'w-12 h-12'}`}
                whileHover={{ scale: 1.1, rotate: 5 }}
              />
              <div className="hidden sm:block">
                <span className={`font-bold text-white block leading-none transition-all ${isScrolled ? 'text-lg' : 'text-xl'}`}>
                  Neuronova
                </span>
                <span className="text-[10px] text-primary tracking-wider uppercase">Tech • Intelligence • Afrique</span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full ${
                    activeSection === link.href.replace('#', '') 
                      ? 'text-primary' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                  data-testid={`nav-link-${link.name.toLowerCase()}`}
                >
                  {link.name}
                  {activeSection === link.href.replace('#', '') && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-primary/10 border border-primary/30 rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => scrollToSection('#contact')}
                  variant="outline"
                  className="h-10 px-5 rounded-full border-white/20 text-white hover:bg-white/10 hover:border-white/40"
                >
                  <Calendar size={16} className="mr-2" />
                  Réserver une démo
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => scrollToSection('#contact')}
                  className="h-10 px-5 rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
                  data-testid="nav-contact-btn"
                >
                  <Phone size={16} className="mr-2" />
                  Contactez-nous
                </Button>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white rounded-lg hover:bg-white/10 transition-colors"
              data-testid="mobile-menu-toggle"
              aria-label="Toggle menu"
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </motion.div>
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
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
              onClick={() => setIsMobileMenuOpen(false)} 
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-slate-900 border-l border-white/10 p-6 pt-24"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link, i) => (
                  <motion.button
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => scrollToSection(link.href)}
                    className={`text-left text-lg font-medium py-3 px-4 rounded-xl transition-all ${
                      activeSection === link.href.replace('#', '')
                        ? "bg-primary/10 text-primary border border-primary/30"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                    data-testid={`mobile-nav-link-${link.name.toLowerCase()}`}
                  >
                    {link.name}
                  </motion.button>
                ))}
                
                <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                  <Button 
                    onClick={() => scrollToSection('#contact')}
                    className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90"
                    data-testid="mobile-contact-btn"
                  >
                    <Phone size={18} className="mr-2" />
                    Contactez-nous
                  </Button>
                  <Button 
                    onClick={() => scrollToSection('#contact')}
                    variant="outline"
                    className="w-full h-12 rounded-xl border-white/20"
                  >
                    <Calendar size={18} className="mr-2" />
                    Réserver une démo
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
