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
      transition={{ delay: 2, type: "spring", stiffness: 200 }}
      onClick={handleClick}
      className="whatsapp-btn fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white shadow-2xl transition-all flex items-center justify-center group"
      aria-label="Contacter sur WhatsApp"
      data-testid="whatsapp-button"
    >
      <MessageCircle size={28} className="group-hover:scale-110 transition-transform" />
      
      {/* Tooltip */}
      <span className="absolute right-full mr-4 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10">
        Discuter sur WhatsApp
      </span>
    </motion.button>
  );
}
