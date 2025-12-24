import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const services = [
  { value: "web", label: "Création de Sites Web" },
  { value: "ai", label: "Agents IA" },
  { value: "gadgets", label: "Gadgets Tech" },
  { value: "security", label: "Cybersécurité" },
  { value: "design", label: "Design & Montage Vidéo" },
  { value: "coaching", label: "Coaching Entrepreneurial" },
];

export default function QuoteModal({ isOpen, onClose, preselectedService }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: preselectedService || "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.service || !formData.message) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API}/quote`, formData);
      toast.success(response.data.message);
      setFormData({ name: "", email: "", service: "", message: "" });
      onClose();
    } catch (error) {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
      console.error("Quote submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            onClick={onClose}
            data-testid="quote-modal-backdrop"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
            data-testid="quote-modal"
          >
            <div className="bg-background border border-white/10 rounded-3xl w-full max-w-lg p-8 relative pointer-events-auto">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 transition-colors"
                aria-label="Fermer"
                data-testid="quote-modal-close"
              >
                <X size={20} className="text-muted-foreground" />
              </button>

              {/* Header */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Demander un Devis
                </h2>
                <p className="text-muted-foreground">
                  Décrivez votre projet et nous vous répondrons sous 24h.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="quote-name">Nom complet</Label>
                  <Input
                    id="quote-name"
                    placeholder="Votre nom"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                    data-testid="quote-name-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quote-email">Email</Label>
                  <Input
                    id="quote-email"
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                    data-testid="quote-email-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quote-service">Service souhaité</Label>
                  <Select
                    value={formData.service}
                    onValueChange={(value) => setFormData({ ...formData, service: value })}
                  >
                    <SelectTrigger className="form-input" data-testid="quote-service-select">
                      <SelectValue placeholder="Sélectionnez un service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.value} value={service.value}>
                          {service.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quote-message">Description du projet</Label>
                  <Textarea
                    id="quote-message"
                    placeholder="Décrivez votre projet en détail..."
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="form-input resize-none"
                    data-testid="quote-message-input"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary"
                  data-testid="quote-submit-btn"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin mr-2" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send size={18} className="mr-2" />
                      Envoyer la demande
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
