import { motion } from "framer-motion";
import { Globe, Bot, Cpu, Shield, Palette, Rocket, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

const iconMap = {
  Globe: Globe,
  Bot: Bot,
  Cpu: Cpu,
  Shield: Shield,
  Palette: Palette,
  Rocket: Rocket,
};

export default function ServiceCard({ service, index, onLearnMore }) {
  const IconComponent = iconMap[service.icon] || Globe;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="service-card group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 hover:border-primary/50"
      data-testid={`service-card-${service.id}`}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className="service-icon w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 transition-all duration-300">
          <IconComponent size={32} className="text-primary" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-foreground mb-3">{service.title}</h3>

        {/* Description */}
        <p className="text-muted-foreground leading-relaxed mb-6">{service.description}</p>

        {/* CTA Button */}
        <Button
          variant="ghost"
          onClick={() => onLearnMore && onLearnMore(service)}
          className="text-primary hover:text-primary hover:bg-primary/10 p-0 h-auto font-medium group/btn"
          data-testid={`service-learn-more-${service.id}`}
        >
          En savoir plus
          <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </div>

      {/* Decorative element */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500" />
    </motion.div>
  );
}
