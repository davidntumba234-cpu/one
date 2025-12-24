import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const INITIAL_MESSAGE = {
  id: 1,
  type: "bot",
  text: "Bonjour ! 👋 Je suis Julia, votre assistante virtuelle Neuronova. Comment puis-je vous aider aujourd'hui ?",
  options: [
    "En savoir plus sur vos services",
    "Demander un devis",
    "Parler à un conseiller",
    "Horaires d'ouverture"
  ]
};

const BOT_RESPONSES = {
  "En savoir plus sur vos services": "Nous offrons 60+ services dans 6 catégories : Développement Web & Mobile, Intelligence Artificielle, Cybersécurité, Design & Branding, Consulting Tech, et Objets Connectés. Quel domaine vous intéresse ?",
  "Demander un devis": "Parfait ! Pour un devis personnalisé, veuillez remplir notre formulaire de contact ou nous appeler au +243 846 378 116. Notre équipe vous répondra sous 24h.",
  "Parler à un conseiller": "Nos conseillers sont disponibles du Lundi au Vendredi, 8h-18h. Vous pouvez nous joindre via WhatsApp au +243 846 378 116 ou par email à contact@neuronova.com",
  "Horaires d'ouverture": "Nous sommes ouverts du Lundi au Vendredi de 8h00 à 18h00. Pour les urgences, notre support WhatsApp est disponible 24/7.",
  "default": "Merci pour votre message ! Un membre de notre équipe vous contactera très bientôt. En attendant, n'hésitez pas à explorer nos services ou nous appeler au +243 846 378 116."
};

export default function ChatbotJulia() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleOptionClick = (option) => {
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: "user",
      text: option
    };
    setMessages(prev => [...prev, userMessage]);

    // Simulate typing
    setIsTyping(true);
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: "bot",
        text: BOT_RESPONSES[option] || BOT_RESPONSES["default"]
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      text: inputValue
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    setIsTyping(true);
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: "bot",
        text: BOT_RESPONSES["default"]
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 left-8 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg shadow-primary/30 flex items-center justify-center group"
            data-testid="chatbot-button"
          >
            <Bot size={28} />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center text-xs font-bold text-black">
              1
            </span>
            {/* Tooltip */}
            <span className="absolute left-full ml-4 px-3 py-2 rounded-lg bg-slate-900 text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-white/10">
              Discuter avec Julia
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed bottom-8 left-8 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-4rem)] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 flex flex-col bg-slate-900"
            data-testid="chatbot-window"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-blue-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Julia</h3>
                  <p className="text-xs text-white/70 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    En ligne
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                data-testid="chatbot-close"
              >
                <X size={20} className="text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] ${message.type === "user" ? "order-1" : ""}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.type === "user"
                          ? "bg-primary text-white rounded-br-sm"
                          : "bg-slate-800 text-white rounded-bl-sm"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                    
                    {/* Options */}
                    {message.options && (
                      <div className="mt-3 space-y-2">
                        {message.options.map((option, i) => (
                          <button
                            key={i}
                            onClick={() => handleOptionClick(option)}
                            className="w-full text-left px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm text-white border border-white/10 hover:border-primary/50 transition-all"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                          className="w-2 h-2 rounded-full bg-slate-500"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-slate-900">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Écrivez votre message..."
                  className="flex-1 bg-slate-800 border-white/10 focus:border-primary h-11 rounded-xl"
                  data-testid="chatbot-input"
                />
                <Button
                  onClick={handleSend}
                  className="w-11 h-11 rounded-xl bg-primary hover:bg-primary/90 p-0"
                  data-testid="chatbot-send"
                >
                  <Send size={18} />
                </Button>
              </div>
              <p className="text-xs text-slate-500 text-center mt-2">
                Propulsé par Neuronova AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
