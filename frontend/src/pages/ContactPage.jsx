import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const contactInfo = [
  {
    icon: MapPin,
    title: "Adresse",
    content: "Avenue Colonel Ebeya, Gombe, Kinshasa, RDC",
    link: null,
  },
  {
    icon: Phone,
    title: "Téléphone",
    content: "+243 846 378 116",
    link: "tel:+243846378116",
  },
  {
    icon: Mail,
    title: "Email",
    content: "contact@neuronova.com",
    link: "mailto:contact@neuronova.com",
  },
  {
    icon: Clock,
    title: "Heures d'ouverture",
    content: "Lun - Ven: 8h00 - 18h00",
    link: null,
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API}/contact`, formData);
      toast.success(response.data.message);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
      console.error("Contact submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openWhatsApp = () => {
    const message = "Bonjour Neuronova! Je souhaite en savoir plus sur vos services.";
    const url = `https://wa.me/243846378116?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen pt-24" data-testid="contact-page">
      {/* Hero Section */}
      <section className="section-padding pt-12 pb-12">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-sm font-mono uppercase tracking-widest text-primary/80 mb-4 block">
              Contact
            </span>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-foreground mb-6" data-testid="contact-title">
              Parlons de Votre Projet
            </h1>
            <p className="text-lg text-muted-foreground">
              Nous sommes là pour vous aider. Contactez-nous et commençons à 
              construire quelque chose d'extraordinaire ensemble.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="pb-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-8 md:p-10 rounded-3xl border border-white/10 bg-white/5"
            >
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Envoyez-nous un Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input
                      id="name"
                      placeholder="Votre nom"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="form-input"
                      data-testid="contact-name-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="form-input"
                      data-testid="contact-email-input"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone (optionnel)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+243 XXX XXX XXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-input"
                    data-testid="contact-phone-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Décrivez votre projet ou votre demande..."
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="form-input resize-none"
                    data-testid="contact-message-input"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary"
                  data-testid="contact-submit-btn"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin mr-2" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send size={18} className="mr-2" />
                      Envoyer le message
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* Contact Info & Map */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-8"
            >
              {/* Contact Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contactInfo.map((info, index) => (
                  <div
                    key={info.title}
                    className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-primary/30 transition-colors"
                    data-testid={`contact-info-${info.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <info.icon size={22} className="text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
                    {info.link ? (
                      <a
                        href={info.link}
                        className="text-muted-foreground hover:text-primary transition-colors text-sm"
                      >
                        {info.content}
                      </a>
                    ) : (
                      <p className="text-muted-foreground text-sm">{info.content}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Quick Contact Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={openWhatsApp}
                  className="flex-1 h-14 bg-[#25D366] hover:bg-[#128C7E] text-white"
                  data-testid="whatsapp-contact-btn"
                >
                  <MessageCircle size={20} className="mr-2" />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-14 btn-outline"
                  onClick={() => window.open("weixin://", "_blank")}
                  data-testid="wechat-contact-btn"
                >
                  WeChat
                </Button>
              </div>

              {/* Google Map */}
              <div className="map-container h-[300px] md:h-[350px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3978.5025673693284!2d15.308489999999998!3d-4.3015839999999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a6a33e0e0e0e0e1%3A0x1a6a33e0e0e0e0e1!2sAvenue%20Colonel%20Ebeya%2C%20Kinshasa%2C%20Democratic%20Republic%20of%20the%20Congo!5e0!3m2!1sen!2s!4v1699000000000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localisation Neuronova"
                  data-testid="google-map"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="section-padding bg-muted/20 border-t border-white/5">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">
              Questions Fréquentes
            </h2>
            <p className="text-muted-foreground mb-8">
              Vous avez des questions? Notre équipe est disponible pour y répondre. 
              N'hésitez pas à nous contacter directement.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-6 rounded-2xl bg-secondary/50 border border-white/5">
                <h3 className="font-semibold text-foreground mb-2">Délais de réponse</h3>
                <p className="text-muted-foreground text-sm">
                  Nous répondons généralement sous 24 heures ouvrables.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-secondary/50 border border-white/5">
                <h3 className="font-semibold text-foreground mb-2">Devis gratuit</h3>
                <p className="text-muted-foreground text-sm">
                  Tous nos devis sont gratuits et sans engagement.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-secondary/50 border border-white/5">
                <h3 className="font-semibold text-foreground mb-2">Support continu</h3>
                <p className="text-muted-foreground text-sm">
                  Support technique disponible pour tous nos clients.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
