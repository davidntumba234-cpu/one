import { Facebook, Linkedin, Instagram, Mail, Phone, MapPin, ArrowUp } from "lucide-react";

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

const services = [
  "Développement Web & Mobile",
  "Intelligence Artificielle",
  "Cybersécurité",
  "Design & Branding",
  "Consulting Tech",
  "Objets Connectés",
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-slate-950 border-t border-white/5" data-testid="footer">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
      
      <div className="container-custom relative py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <div>
                <span className="font-bold text-xl text-white block">Neuronova</span>
                <span className="text-xs text-primary tracking-wider">Tech. Intelligence. Afrique.</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Propulser les entreprises africaines vers le futur grâce à l'innovation technologique.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
                  aria-label={social.label}
                  data-testid={`footer-social-${social.label.toLowerCase()}`}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-lg">Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <button
                    onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                    className="footer-link"
                  >
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-lg">Navigation</h4>
            <ul className="space-y-3">
              {['Accueil', 'Services', 'Histoire', 'Mission', 'Fondateurs', 'Contact'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
                    className="footer-link"
                  >
                    {item}
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
                <MapPin size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <span className="text-slate-400 text-sm">
                  Avenue Colonel Ebeya, Gombe, Kinshasa, RDC
                </span>
              </li>
              <li>
                <a
                  href="tel:+243846378116"
                  className="flex items-center gap-3 text-slate-400 hover:text-primary transition-colors text-sm"
                  data-testid="footer-phone"
                >
                  <Phone size={18} className="text-primary flex-shrink-0" />
                  +243 846 378 116
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@neuronova.com"
                  className="flex items-center gap-3 text-slate-400 hover:text-primary transition-colors text-sm"
                  data-testid="footer-email"
                >
                  <Mail size={18} className="text-primary flex-shrink-0" />
                  contact@neuronova.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Neuronova. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-slate-500 hover:text-primary transition-colors">
              Politique de confidentialité
            </a>
            <a href="#" className="text-slate-500 hover:text-primary transition-colors">
              Mentions légales
            </a>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="absolute right-8 bottom-8 w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300"
        aria-label="Retour en haut"
        data-testid="back-to-top"
      >
        <ArrowUp size={20} />
      </button>
    </footer>
  );
}
