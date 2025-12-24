import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Target, Eye, Heart, Lightbulb, Users, Globe, Linkedin, Twitter } from "lucide-react";
import { Button } from "../components/ui/button";

const founders = [
  {
    name: "Jordan Leko",
    role: "Co-fondateur & CTO",
    bio: "Expert en développement logiciel et innovation technologique, Jordan est passionné par la transformation digitale en Afrique. Avec plus de 8 ans d'expérience dans le développement de solutions tech, il dirige la vision technique de Neuronova.",
    image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "David Ntumba",
    role: "Co-fondateur & CEO",
    bio: "Né le 22 mai 2006, David est un visionnaire à l'origine de Neuronova. Spécialiste en entrepreneuriat, marketing digital et stratégie de croissance, il est le moteur derrière la mission de l'entreprise de révolutionner le paysage tech africain.",
    image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
    linkedin: "#",
    twitter: "#",
  },
];

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Nous repoussons constamment les limites de la technologie pour créer des solutions qui façonnent l'avenir.",
  },
  {
    icon: Heart,
    title: "Engagement",
    description: "Notre engagement envers l'excellence et la satisfaction client guide chaque projet que nous entreprenons.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Nous croyons au pouvoir du travail d'équipe et de la collaboration avec nos clients et partenaires.",
  },
  {
    icon: Globe,
    title: "Impact Africain",
    description: "Notre mission est de contribuer au développement technologique et économique du continent africain.",
  },
];

const milestones = [
  { year: "2023", event: "Fondation de Neuronova à Kinshasa" },
  { year: "2023", event: "Premiers projets de développement web" },
  { year: "2024", event: "Lancement de la division IA" },
  { year: "2024", event: "Expansion vers d'autres pays africains" },
  { year: "2025", event: "50+ clients et 100+ projets réalisés" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24" data-testid="about-page">
      {/* Hero Section */}
      <section className="section-padding pt-12">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <span className="text-sm font-mono uppercase tracking-widest text-primary/80 mb-4 block">
              À Propos
            </span>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-foreground mb-6" data-testid="about-title">
              Façonner l'Avenir Tech de l'Afrique
            </h1>
            <p className="text-lg text-muted-foreground">
              Neuronova est née de la conviction que l'Afrique a le potentiel de devenir 
              un leader mondial de l'innovation technologique.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="pb-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 md:p-12 rounded-3xl border border-white/10 bg-white/5"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Eye size={28} className="text-primary" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">Notre Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                Devenir la référence africaine en matière d'innovation technologique, 
                en créant des solutions qui transforment les entreprises et améliorent 
                la vie quotidienne de millions de personnes à travers le continent.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 md:p-12 rounded-3xl border border-white/10 bg-white/5"
            >
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                <Target size={28} className="text-accent" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">Notre Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                Propulser les entreprises africaines vers le futur grâce à l'intelligence 
                artificielle, la cybersécurité, le design digital et des solutions 
                technologiques sur mesure qui répondent aux défis uniques du continent.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="section-padding bg-muted/20" data-testid="founders-section">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-mono uppercase tracking-widest text-primary/80 mb-4 block">
              Notre Équipe
            </span>
            <h2 className="text-3xl md:text-5xl font-medium text-foreground mb-4">
              Les Visionnaires Derrière Neuronova
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Rencontrez les fondateurs qui ont créé Neuronova avec la mission de 
              transformer le paysage technologique africain.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {founders.map((founder, index) => (
              <motion.div
                key={founder.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="founder-card group"
                data-testid={`founder-${founder.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-semibold text-foreground mb-1">
                    {founder.name}
                  </h3>
                  <p className="text-primary font-medium mb-4">{founder.role}</p>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {founder.bio}
                  </p>

                  {/* Social Links */}
                  <div className="flex gap-3">
                    <a
                      href={founder.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      aria-label={`${founder.name} LinkedIn`}
                    >
                      <Linkedin size={18} />
                    </a>
                    <a
                      href={founder.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      aria-label={`${founder.name} Twitter`}
                    >
                      <Twitter size={18} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding" data-testid="values-section">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-mono uppercase tracking-widest text-primary/80 mb-4 block">
              Nos Valeurs
            </span>
            <h2 className="text-3xl md:text-5xl font-medium text-foreground mb-4">
              Ce Qui Nous Guide
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nos valeurs fondamentales définissent notre approche et notre engagement 
              envers l'excellence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="value-card text-center"
                data-testid={`value-${value.title.toLowerCase()}`}
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <value.icon size={28} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-padding bg-muted/20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-mono uppercase tracking-widest text-primary/80 mb-4 block">
              Notre Parcours
            </span>
            <h2 className="text-3xl md:text-5xl font-medium text-foreground">
              Moments Clés
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-6 mb-8"
              >
                <div className="w-20 text-right">
                  <span className="text-primary font-bold text-xl">{milestone.year}</span>
                </div>
                <div className="w-4 h-4 rounded-full bg-primary flex-shrink-0" />
                <div className="flex-1 p-4 rounded-xl bg-secondary/50 border border-white/5">
                  <p className="text-foreground">{milestone.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-medium text-foreground mb-6">
              Rejoignez l'Aventure Neuronova
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Que vous soyez entrepreneur, entreprise établie ou startup en devenir, 
              nous sommes prêts à vous accompagner dans votre transformation digitale.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact">
                <Button className="btn-primary" data-testid="about-contact-btn">
                  Nous Contacter
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" className="btn-outline" data-testid="about-services-btn">
                  Découvrir nos Services
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
