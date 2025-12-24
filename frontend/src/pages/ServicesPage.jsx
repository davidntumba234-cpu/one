import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe, Bot, Cpu, Shield, Palette, Rocket, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import QuoteModal from "../components/QuoteModal";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const iconMap = {
  Globe: Globe,
  Bot: Bot,
  Cpu: Cpu,
  Shield: Shield,
  Palette: Palette,
  Rocket: Rocket,
};

const serviceDetails = {
  web: {
    features: [
      "Sites vitrines et corporate",
      "E-commerce et marketplaces",
      "Applications web sur mesure",
      "Refonte et optimisation",
      "Maintenance et support",
    ],
    technologies: ["React", "Node.js", "Python", "MongoDB", "AWS"],
  },
  ai: {
    features: [
      "Chatbots intelligents",
      "Assistants virtuels",
      "Automatisation des processus",
      "Analyse prédictive",
      "Traitement du langage naturel",
    ],
    technologies: ["OpenAI", "TensorFlow", "Python", "LangChain", "Pinecone"],
  },
  gadgets: {
    features: [
      "Prototypage rapide",
      "Solutions IoT",
      "Électronique embarquée",
      "Conception PCB",
      "Production en série",
    ],
    technologies: ["Arduino", "Raspberry Pi", "ESP32", "CAD", "3D Printing"],
  },
  security: {
    features: [
      "Audits de sécurité",
      "Tests de pénétration",
      "Protection des données",
      "Formation du personnel",
      "Conformité RGPD",
    ],
    technologies: ["Kali Linux", "Burp Suite", "OWASP", "Nessus", "Splunk"],
  },
  design: {
    features: [
      "Identité visuelle",
      "UI/UX Design",
      "Montage vidéo",
      "Motion design",
      "Supports marketing",
    ],
    technologies: ["Figma", "Adobe Suite", "After Effects", "Blender", "DaVinci"],
  },
  coaching: {
    features: [
      "Stratégie business",
      "Mentorat personnalisé",
      "Formation technique",
      "Levée de fonds",
      "Go-to-market",
    ],
    technologies: ["Lean Startup", "Design Thinking", "Agile", "OKR", "Pitch Deck"],
  },
};

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  useEffect(() => {
    fetchServices();
    window.scrollTo(0, 0);
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API}/services`);
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleRequestQuote = (serviceId) => {
    setSelectedService(serviceId);
    setIsQuoteModalOpen(true);
  };

  return (
    <div className="min-h-screen pt-24" data-testid="services-page">
      {/* Hero Section */}
      <section className="section-padding pt-12">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <span className="text-sm font-mono uppercase tracking-widest text-primary/80 mb-4 block">
              Nos Services
            </span>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-foreground mb-6" data-testid="services-title">
              Solutions Sur Mesure pour Votre Succès
            </h1>
            <p className="text-lg text-muted-foreground">
              Nous combinons expertise technique et vision créative pour offrir des 
              solutions innovantes adaptées à vos besoins spécifiques.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-24">
        <div className="container-custom">
          <div className="space-y-24">
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Globe;
              const details = serviceDetails[service.id] || { features: [], technologies: [] };
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                    !isEven ? "lg:flex-row-reverse" : ""
                  }`}
                  data-testid={`service-detail-${service.id}`}
                >
                  {/* Content */}
                  <div className={isEven ? "lg:order-1" : "lg:order-2"}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <IconComponent size={28} className="text-primary" />
                      </div>
                      <h2 className="text-3xl font-semibold text-foreground">
                        {service.title}
                      </h2>
                    </div>

                    <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                      {service.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-3 mb-8">
                      {details.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                            <Check size={12} className="text-primary" />
                          </div>
                          <span className="text-foreground/90">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {details.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-secondary text-sm text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <Button
                      onClick={() => handleRequestQuote(service.id)}
                      className="btn-primary"
                      data-testid={`request-quote-${service.id}`}
                    >
                      Demander un devis
                    </Button>
                  </div>

                  {/* Visual */}
                  <div className={isEven ? "lg:order-2" : "lg:order-1"}>
                    <div className="relative">
                      <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 p-8 flex items-center justify-center">
                        <IconComponent size={120} className="text-primary/30" />
                      </div>
                      {/* Decorative elements */}
                      <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-primary/10 blur-2xl" />
                      <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-accent/10 blur-2xl" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-muted/20 border-t border-white/5">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-medium text-foreground mb-6">
              Vous avez un projet en tête?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Contactez-nous pour une consultation gratuite. Nos experts sont prêts 
              à vous accompagner dans la réalisation de vos ambitions.
            </p>
            <Button
              onClick={() => setIsQuoteModalOpen(true)}
              className="btn-primary text-base"
              data-testid="cta-request-quote"
            >
              Demander un devis gratuit
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        preselectedService={selectedService}
      />
    </div>
  );
}
