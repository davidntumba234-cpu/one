import { useState } from "react";
import { motion } from "framer-motion";
import { Facebook, Linkedin, Instagram, Mail, Phone, MapPin, ArrowUp, Send, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";

const NEURONOVA_LOGO = "https://customer-assets.emergentagent.com/job_029cb03c-63b5-427f-af8c-afed8e65308a/artifacts/1rt013g6_file_00000000871c71f79e6e1c736e9fbdf8.png";

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook", color: "hover:bg-blue-600" },
  { icon: Instagram, href: "#", label: "Instagram", color: "hover:bg-pink-600" },
  { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:bg-blue-700" },
  { icon: MessageCircle, href: "https://wa.me/243846378116", label: "WhatsApp", color: "hover:bg-green-600" },
];

const services = [
  "Développement Web & Mobile",
  "Intelligence Artificielle",
  "Cybersécurité",
  "Design & Branding",
  "Consulting Tech",
  "Objets Connectés",
];

const quickLinks = [
  { name: "Accueil", href: "#hero" },
  { name: "Services", href: "#services" },
  { name: "À propos", href: "#histoire" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Témoignages", href: "#testimonials" },
  { name: "FAQ", href: "#faq" },
  { name: "Contact", href: "#contact" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Veuillez entrer votre email");
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Merci ! Vous êtes inscrit à notre newsletter.");
    setEmail("");
    setIsSubmitting(false);
  };

  return (
    <footer className="relative bg-slate-950 border-t border-white/5" data-testid="footer">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
      
      {/* Newsletter Section */}
      <div className="border-b border-white/5">
        <div className="container-custom py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-white/10"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Restez informé</h3>
              <p className="text-slate-400">Inscrivez-vous à notre newsletter pour recevoir nos dernières actualités</p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-3 w-full md:w-auto">
              <Input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-900/50 border-white/10 w-full md:w-64 h-12 rounded-xl"
                data-testid="newsletter-email"
              />
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90"
                data-testid="newsletter-submit"
              >
                {isSubmitting ? "..." : <Send size={18} />}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
      
      <div className="container-custom relative py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src={NEURONOVA_LOGO} 
                alt="Neuronova Logo" 
                className="w-14 h-14"
              />
              <div>
                <span className="font-bold text-xl text-white block">Neuronova</span>
                <span className="text-xs text-primary tracking-wider">Tech. Intelligence. Afrique.</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Agence digitale premium spécialisée en IA, développement web, cybersécurité et design. Propulsons ensemble votre entreprise vers le futur.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white ${social.color} hover:border-transparent transition-all duration-300`}
                  aria-label={social.label}
                  data-testid={`footer-social-${social.label.toLowerCase()}`}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-lg">Nos Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <button
                    onClick={() => scrollToSection('#services')}
                    className="text-slate-400 hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-lg">Navigation</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-slate-400 hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-lg">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-primary" />
                </div>
                <div>
                  <span className="text-white text-sm font-medium block">Adresse</span>
                  <span className="text-slate-400 text-sm">Avenue Colonel Ebeya, Gombe, Kinshasa, RDC</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-primary" />
                </div>
                <div>
                  <span className="text-white text-sm font-medium block">Téléphone</span>
                  <a href="tel:+243846378116" className="text-slate-400 hover:text-primary text-sm transition-colors">
                    +243 846 378 116
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-primary" />
                </div>
                <div>
                  <span className="text-white text-sm font-medium block">Email</span>
                  <a href="mailto:contact@neuronova.com" className="text-slate-400 hover:text-primary text-sm transition-colors">
                    contact@neuronova.com
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Neuronova. Tous droits réservés. Made with ❤️ in Kinshasa
          </p>
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-slate-500 hover:text-primary transition-colors">
              Politique de confidentialité
            </a>
            <a href="#" className="text-slate-500 hover:text-primary transition-colors">
              Conditions d'utilisation
            </a>
            <a href="#" className="text-slate-500 hover:text-primary transition-colors">
              Mentions légales
            </a>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="absolute right-8 bottom-8 w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 z-40"
        aria-label="Retour en haut"
        data-testid="back-to-top"
      >
        <ArrowUp size={20} />
      </motion.button>
    </footer>
  );
}
