import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Users, Award, Globe } from "lucide-react";
import { Button } from "../components/ui/button";
import ServiceCard from "../components/ServiceCard";
import TestimonialSlider from "../components/TestimonialSlider";
import QuoteModal from "../components/QuoteModal";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const stats = [
  { icon: Users, value: "50+", label: "Clients satisfaits" },
  { icon: Award, value: "100+", label: "Projets réalisés" },
  { icon: Globe, value: "5", label: "Pays couverts" },
  { icon: Zap, value: "24/7", label: "Support disponible" },
];

export default function HomePage() {
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesRes, testimonialsRes] = await Promise.all([
        axios.get(`${API}/services`),
        axios.get(`${API}/testimonials`),
      ]);
      setServices(servicesRes.data);
      setTestimonials(testimonialsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleLearnMore = (service) => {
    setSelectedService(service.id);
    setIsQuoteModalOpen(true);
  };

  return (
    <div className="min-h-screen" data-testid="home-page">
      {/* Hero Section */}
      <section className="hero-bg relative min-h-screen flex items-center noise-overlay circuit-pattern">
        <div className="container-custom relative z-10 pt-24">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                Meta-Tech Africaine
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-semibold tracking-tight text-foreground mb-6"
              data-testid="hero-title"
            >
              L'Innovation{" "}
              <span className="gradient-text">Technologique</span>
              <br />
              au Coeur de l'Afrique
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl"
            >
              Nous propulsons les entreprises africaines vers le futur grâce à l'IA, 
              la cybersécurité, le design digital et des solutions technologiques sur mesure.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/services">
                <Button className="btn-primary text-base" data-testid="discover-services-btn">
                  Découvrir nos services
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="btn-outline text-base" data-testid="contact-us-btn">
                  Nous contacter
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-1.5 rounded-full bg-primary"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30 border-y border-white/5">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="stat-item"
                data-testid={`stat-${index}`}
              >
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="stat-number">{stat.value}</div>
                <div className="stat-label text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="section-padding" data-testid="services-section">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-mono uppercase tracking-widest text-primary/80 mb-4 block">
              Nos Services
            </span>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground mb-6">
              Solutions Technologiques Complètes
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              De la création web à l'intelligence artificielle, nous offrons une gamme complète 
              de services pour transformer votre vision en réalité.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.slice(0, 6).map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
                onLearnMore={handleLearnMore}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/services">
              <Button variant="outline" className="btn-outline" data-testid="view-all-services-btn">
                Voir tous nos services
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-muted/20" data-testid="testimonials-section">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-mono uppercase tracking-widest text-primary/80 mb-4 block">
              Témoignages
            </span>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground mb-6">
              Ce Que Disent Nos Clients
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Découvrez les retours d'expérience de nos clients satisfaits.
            </p>
          </motion.div>

          <TestimonialSlider testimonials={testimonials} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground mb-6">
              Prêt à Transformer Votre Entreprise?
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              Contactez-nous dès aujourd'hui pour discuter de votre projet et découvrir 
              comment nous pouvons vous aider à atteindre vos objectifs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                onClick={() => setIsQuoteModalOpen(true)} 
                className="btn-primary text-base"
                data-testid="request-quote-btn"
              >
                Demander un devis gratuit
              </Button>
              <Link to="/about">
                <Button variant="outline" className="btn-outline text-base" data-testid="learn-about-btn">
                  En savoir plus sur nous
                </Button>
              </Link>
            </div>
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
