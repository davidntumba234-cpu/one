import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "+243846378116";
const WHATSAPP_MESSAGE = "Bonjour Neuronova! Je souhaite en savoir plus sur vos services.";

export default function WhatsAppButton() {
  const handleClick = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER.replace(/\s+/g, '')}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    window.open(url, '_blank');
  };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      onClick={handleClick}
      className="whatsapp-btn fixed bottom-6 right-6 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
      aria-label="Contacter sur WhatsApp"
      data-testid="whatsapp-button"
    >
      <MessageCircle size={28} className="md:w-8 md:h-8" />
      
      {/* Pulse animation */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
    </motion.button>
  );
}
