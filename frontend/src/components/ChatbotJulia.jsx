import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, X, Send, Bot, Sparkles, Calculator, 
  Check, ShoppingCart, Phone, Mail, Calendar, FileText,
  ChevronRight, Trash2, Download, Share2, HelpCircle
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Services Database
const SERVICES_DB = {
  creation: {
    name: "Création & Développement",
    services: [
      { id: "site-vitrine", name: "Site vitrine simple (1-5 pages)", price_usd: 400, price_fc: 880000 },
      { id: "site-pro", name: "Site pro complet (5-10 pages)", price_usd: 800, price_fc: 1760000 },
      { id: "ecommerce", name: "E-commerce (avec paiement)", price_usd: 1300, price_fc: 2860000 },
      { id: "app-mobile", name: "Application mobile (Android/iOS)", price_usd: 2000, price_fc: 4400000 },
      { id: "app-web", name: "Application web", price_usd: 1000, price_fc: 2200000 },
      { id: "maintenance", name: "Maintenance site mensuelle", price_usd: 50, price_fc: 110000 },
      { id: "refonte", name: "Mise à jour & refonte", price_usd: 100, price_fc: 220000 },
    ]
  },
  ai: {
    name: "Intelligence Artificielle",
    services: [
      { id: "agent-ai", name: "Agent AI (WhatsApp, Web)", price_usd: 250, price_fc: 550000 },
      { id: "generateur-devis", name: "Générateur automatique de devis", price_usd: 150, price_fc: 330000 },
      { id: "integration-ia", name: "Intégration IA sur site", price_usd: 200, price_fc: 440000 },
      { id: "agent-julia", name: "Agent Julia personnalisé", price_usd: 300, price_fc: 660000 },
      { id: "automatisation", name: "Automatisation des tâches", price_usd: 180, price_fc: 396000 },
    ]
  },
  design: {
    name: "Design & Contenu",
    services: [
      { id: "logo", name: "Logo professionnel", price_usd: 50, price_fc: 110000 },
      { id: "identite-visuelle", name: "Identité visuelle complète", price_usd: 120, price_fc: 264000 },
      { id: "affiche", name: "Affiche/flyer pro", price_usd: 30, price_fc: 66000 },
      { id: "video-promo", name: "Vidéo promotionnelle", price_usd: 100, price_fc: 220000 },
      { id: "powerpoint", name: "Présentation PowerPoint", price_usd: 40, price_fc: 88000 },
      { id: "motion-design", name: "Motion design", price_usd: 90, price_fc: 198000 },
      { id: "montage-video", name: "Montage vidéo", price_usd: 80, price_fc: 176000 },
    ]
  },
  security: {
    name: "Sécurité & Hébergement",
    services: [
      { id: "hebergement", name: "Hébergement cloud (mensuel)", price_usd: 25, price_fc: 55000 },
      { id: "ssl", name: "Sécurisation site / SSL", price_usd: 30, price_fc: 66000 },
      { id: "firewall", name: "Firewall & protection cyber", price_usd: 150, price_fc: 330000 },
      { id: "monitoring", name: "Monitoring & sauvegarde", price_usd: 60, price_fc: 132000 },
    ]
  },
  business: {
    name: "Entrepreneuriat",
    services: [
      { id: "business-plan", name: "Création de business plan", price_usd: 500, price_fc: 1100000 },
      { id: "creation-entreprise", name: "Accompagnement création entreprise", price_usd: 200, price_fc: 440000 },
      { id: "coaching", name: "Coaching entrepreneurial (séance)", price_usd: 40, price_fc: 88000 },
      { id: "formation", name: "Formation entrepreneuriale", price_usd: 150, price_fc: 330000 },
      { id: "diagnostic", name: "Diagnostic entreprise numérique", price_usd: 70, price_fc: 154000 },
      { id: "pitch-deck", name: "Élaboration pitch deck", price_usd: 60, price_fc: 132000 },
      { id: "mentorat", name: "Mentorat 1 mois", price_usd: 150, price_fc: 330000 },
    ]
  },
  innovation: {
    name: "Prototypage & Innovation",
    services: [
      { id: "prototype-gadget", name: "Conception prototype gadget", price_usd: 500, price_fc: 1100000 },
      { id: "fabrication-prototype", name: "Fabrication prototype tech", price_usd: 800, price_fc: 1760000 },
      { id: "prototype-ai-iot", name: "Prototype AI ou IoT", price_usd: 600, price_fc: 1320000 },
    ]
  }
};

const PACKS = [
  {
    id: "pack-lancement",
    name: "Pack Lancement d'Entreprise",
    description: "Logo + Site vitrine + Business plan + PowerPoint + Coaching",
    price_usd: 370,
    price_fc: 814000,
    savings: 260
  },
  {
    id: "pack-digitalisation",
    name: "Pack Digitalisation PME",
    description: "Site pro + Agent AI + Hébergement + SSL + Diagnostic + Formation",
    price_usd: 1200,
    price_fc: 2640000,
    savings: 255
  },
  {
    id: "pack-createur",
    name: "Pack Créateur de Contenu",
    description: "Identité visuelle + Vidéo promo + Affiches + Montage vidéo",
    price_usd: 300,
    price_fc: 660000,
    savings: 100
  }
];

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Quel est votre objectif principal ?",
    options: [
      { text: "Créer ma présence en ligne", tags: ["site-vitrine", "logo"] },
      { text: "Vendre en ligne", tags: ["ecommerce", "site-pro"] },
      { text: "Automatiser mon business", tags: ["agent-ai", "automatisation"] },
      { text: "Lancer mon entreprise", tags: ["business-plan", "coaching"] }
    ]
  },
  {
    id: 2,
    question: "Quel est votre budget approximatif ?",
    options: [
      { text: "Moins de 200$", budget: 200 },
      { text: "200$ - 500$", budget: 500 },
      { text: "500$ - 1000$", budget: 1000 },
      { text: "Plus de 1000$", budget: 2000 }
    ]
  },
  {
    id: 3,
    question: "Quel est votre secteur d'activité ?",
    options: [
      { text: "Commerce / Retail", tags: ["ecommerce", "identite-visuelle"] },
      { text: "Services / Consulting", tags: ["site-pro", "agent-ai"] },
      { text: "Tech / Startup", tags: ["app-web", "prototype-ai-iot"] },
      { text: "Autre", tags: ["site-vitrine", "logo"] }
    ]
  }
];

export default function ChatbotJulia() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentView, setCurrentView] = useState("chat"); // chat, quote, services, quiz
  const [selectedServices, setSelectedServices] = useState([]);
  const [clientInfo, setClientInfo] = useState({ name: "", email: "", phone: "", company: "" });
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage(
        "Bonjour ! 👋 Je suis Julia, ton assistante IA Neuronova. Je peux t'aider à :",
        [
          { text: "📊 Générer un devis", action: "quote" },
          { text: "🛒 Voir nos services", action: "services" },
          { text: "🎯 Quiz diagnostic", action: "quiz" },
          { text: "📞 Contacter l'équipe", action: "contact" },
          { text: "❓ Poser une question", action: "question" }
        ]
      );
    }
  }, [isOpen]);

  const addBotMessage = (text, options = null, isQuote = false) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        type: "bot", 
        text, 
        options,
        isQuote 
      }]);
      setIsTyping(false);
    }, 800);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { id: Date.now(), type: "user", text }]);
  };

  const handleOptionClick = (option) => {
    addUserMessage(option.text);

    switch(option.action) {
      case "quote":
        setCurrentView("quote");
        addBotMessage("Super ! 🎯 Sélectionne les services qui t'intéressent. Je calculerai ton devis en temps réel !");
        break;
      case "services":
        setCurrentView("services");
        addBotMessage("Voici nos catégories de services. Clique sur une catégorie pour voir les détails et les prix ! 💼");
        break;
      case "quiz":
        setCurrentView("quiz");
        setCurrentQuizQuestion(0);
        setQuizAnswers([]);
        addBotMessage(QUIZ_QUESTIONS[0].question, 
          QUIZ_QUESTIONS[0].options.map(o => ({ text: o.text, action: "quiz-answer", data: o }))
        );
        break;
      case "contact":
        addBotMessage(
          "Comment souhaites-tu nous contacter ? 📱",
          [
            { text: "📱 WhatsApp", action: "whatsapp" },
            { text: "📧 Email", action: "email" },
            { text: "📅 Réserver un appel", action: "calendar" }
          ]
        );
        break;
      case "whatsapp":
        window.open("https://wa.me/243846378116?text=Bonjour Neuronova! Je viens du site web.", "_blank");
        addBotMessage("J'ai ouvert WhatsApp pour toi ! Notre équipe te répondra rapidement. 🚀");
        break;
      case "email":
        window.open("mailto:serviceneuronova@gmail.com?subject=Demande depuis le site web", "_blank");
        addBotMessage("J'ai ouvert ton client mail ! Tu peux aussi nous écrire directement à serviceneuronova@gmail.com 📧");
        break;
      case "calendar":
        addBotMessage("Pour réserver un appel, contacte-nous sur WhatsApp ou par email. Notre équipe te proposera un créneau ! 📅", [
          { text: "📱 WhatsApp", action: "whatsapp" },
          { text: "📧 Email", action: "email" }
        ]);
        break;
      case "question":
        addBotMessage("Pose-moi ta question ! Je ferai de mon mieux pour t'aider. 😊");
        break;
      case "quiz-answer":
        handleQuizAnswer(option.data);
        break;
      case "pack":
        selectPack(option.data);
        break;
      case "back":
        setCurrentView("chat");
        addBotMessage("Que puis-je faire d'autre pour toi ? 😊", [
          { text: "📊 Générer un devis", action: "quote" },
          { text: "🛒 Voir nos services", action: "services" },
          { text: "📞 Contacter l'équipe", action: "contact" }
        ]);
        break;
      default:
        handleDefaultResponse(option.text);
    }
  };

  const handleQuizAnswer = (data) => {
    const newAnswers = [...quizAnswers, data];
    setQuizAnswers(newAnswers);

    if (currentQuizQuestion < QUIZ_QUESTIONS.length - 1) {
      const nextQ = currentQuizQuestion + 1;
      setCurrentQuizQuestion(nextQ);
      setTimeout(() => {
        addBotMessage(QUIZ_QUESTIONS[nextQ].question,
          QUIZ_QUESTIONS[nextQ].options.map(o => ({ text: o.text, action: "quiz-answer", data: o }))
        );
      }, 500);
    } else {
      // Generate recommendation
      generateRecommendation(newAnswers);
    }
  };

  const generateRecommendation = (answers) => {
    const budget = answers.find(a => a.budget)?.budget || 500;
    const tags = answers.flatMap(a => a.tags || []);
    
    let recommendation = "";
    let suggestedPack = null;

    if (budget <= 200) {
      recommendation = "Avec ton budget, je te recommande de commencer par un logo professionnel et une page de présentation. C'est la base ! 🎯";
    } else if (budget <= 500) {
      recommendation = "Parfait ! Tu peux te lancer avec notre Pack Lancement d'Entreprise. Il inclut tout ce dont tu as besoin pour démarrer ! 🚀";
      suggestedPack = PACKS[0];
    } else if (budget <= 1000) {
      recommendation = "Excellent budget ! Je te conseille le Pack Digitalisation PME pour une transformation digitale complète. 💼";
      suggestedPack = PACKS[1];
    } else {
      recommendation = "Avec ce budget, tu peux vraiment faire des choses incroyables ! Je te propose un devis personnalisé. 🌟";
    }

    addBotMessage(recommendation);

    if (suggestedPack) {
      setTimeout(() => {
        addBotMessage(
          `✨ ${suggestedPack.name}\n${suggestedPack.description}\n\n💰 Prix: ${suggestedPack.price_usd}$ (${suggestedPack.price_fc.toLocaleString()} FC)\n🎁 Économie: ${suggestedPack.savings}$`,
          [
            { text: "✅ Je prends ce pack !", action: "pack", data: suggestedPack },
            { text: "🔧 Je préfère personnaliser", action: "quote" },
            { text: "❓ J'ai des questions", action: "contact" }
          ]
        );
      }, 1000);
    } else {
      setTimeout(() => {
        addBotMessage("Veux-tu que je t'aide à créer un devis personnalisé ? 😊", [
          { text: "📊 Oui, créer mon devis", action: "quote" },
          { text: "📞 Parler à un conseiller", action: "contact" }
        ]);
      }, 1000);
    }

    setCurrentView("chat");
  };

  const selectPack = (pack) => {
    addBotMessage(`Super choix ! 🎉 Le ${pack.name} est parfait pour toi.\n\nPour finaliser, j'ai besoin de quelques infos. Quel est ton nom ?`);
    setSelectedServices([{ ...pack, isPack: true }]);
    setCurrentView("collect-info");
  };

  const handleDefaultResponse = (text) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes("prix") || lowerText.includes("coût") || lowerText.includes("tarif")) {
      addBotMessage("Pour les tarifs, je te conseille de consulter notre section Tarifs ou de générer un devis personnalisé ! 💰", [
        { text: "📊 Générer un devis", action: "quote" },
        { text: "🛒 Voir les tarifs", action: "services" }
      ]);
    } else if (lowerText.includes("délai") || lowerText.includes("temps") || lowerText.includes("combien de temps")) {
      addBotMessage("Nos délais sont optimisés ⚡\n\n• Site vitrine: 72h\n• Application web: 168h (7 jours)\n• Projet IA: 2 semaines\n\nOn est rapides ! 🚀");
    } else if (lowerText.includes("bonjour") || lowerText.includes("salut") || lowerText.includes("hello")) {
      addBotMessage("Salut ! 👋 Bienvenue chez Neuronova ! Comment puis-je t'aider aujourd'hui ?", [
        { text: "📊 Générer un devis", action: "quote" },
        { text: "🛒 Voir nos services", action: "services" },
        { text: "❓ Poser une question", action: "question" }
      ]);
    } else {
      addBotMessage("Merci pour ton message ! 😊 Pour mieux t'aider, tu peux :", [
        { text: "📊 Générer un devis", action: "quote" },
        { text: "📞 Parler à l'équipe", action: "contact" }
      ]);
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    if (currentView === "collect-info") {
      handleInfoCollection(inputValue);
    } else {
      addUserMessage(inputValue);
      handleDefaultResponse(inputValue);
    }
    setInputValue("");
  };

  const handleInfoCollection = (value) => {
    addUserMessage(value);

    if (!clientInfo.name) {
      setClientInfo({ ...clientInfo, name: value });
      addBotMessage("Parfait ! 📧 Et ton email ou numéro WhatsApp ?");
    } else if (!clientInfo.email && !clientInfo.phone) {
      if (value.includes("@")) {
        setClientInfo({ ...clientInfo, email: value });
      } else {
        setClientInfo({ ...clientInfo, phone: value });
      }
      addBotMessage("Super ! 🏢 Le nom de ton entreprise (ou 'Particulier' si c'est personnel) ?");
    } else if (!clientInfo.company) {
      setClientInfo({ ...clientInfo, company: value });
      finalizeQuote({ ...clientInfo, company: value });
    }
  };

  const finalizeQuote = async (info) => {
    const total_usd = selectedServices.reduce((sum, s) => sum + (s.price_usd || 0), 0);
    const total_fc = selectedServices.reduce((sum, s) => sum + (s.price_fc || 0), 0);

    try {
      await axios.post(`${API}/quotes`, {
        client_name: info.name,
        client_email: info.email || null,
        client_phone: info.phone || null,
        company_name: info.company,
        services: selectedServices.map(s => s.name),
        total_usd,
        total_fc,
        notes: selectedServices.some(s => s.isPack) ? "Pack sélectionné" : "Services à la carte"
      });

      addBotMessage(
        `🎉 Excellent ${info.name} ! Ton devis est prêt !\n\n` +
        `📋 Services: ${selectedServices.map(s => s.name).join(", ")}\n\n` +
        `💰 Total: ${total_usd}$ (${total_fc.toLocaleString()} FC)\n\n` +
        `Notre équipe te contactera sous 24h. Tu peux aussi nous joindre directement ! 🚀`,
        [
          { text: "📱 WhatsApp", action: "whatsapp" },
          { text: "📧 Email", action: "email" },
          { text: "🔄 Nouveau devis", action: "back" }
        ],
        true
      );

      toast.success("Devis enregistré avec succès !");
      setCurrentView("chat");
      setSelectedServices([]);
      setClientInfo({ name: "", email: "", phone: "", company: "" });
    } catch (error) {
      addBotMessage("Oups ! Une erreur est survenue. Contacte-nous directement sur WhatsApp ! 📱", [
        { text: "📱 WhatsApp", action: "whatsapp" }
      ]);
    }
  };

  const toggleService = (service) => {
    const exists = selectedServices.find(s => s.id === service.id);
    if (exists) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const getTotalUSD = () => selectedServices.reduce((sum, s) => sum + s.price_usd, 0);
  const getTotalFC = () => selectedServices.reduce((sum, s) => sum + s.price_fc, 0);

  const confirmQuote = () => {
    if (selectedServices.length === 0) {
      toast.error("Sélectionne au moins un service !");
      return;
    }
    addBotMessage(`Parfait ! Tu as sélectionné ${selectedServices.length} service(s) pour un total de ${getTotalUSD()}$ 💰\n\nPour finaliser ton devis, j'ai besoin de quelques infos. Quel est ton nom ?`);
    setCurrentView("collect-info");
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 left-8 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg shadow-primary/30 flex items-center justify-center group"
            data-testid="chatbot-button"
          >
            <Bot size={28} />
            <motion.span 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold"
            >
              !
            </motion.span>
            <span className="absolute left-full ml-4 px-3 py-2 rounded-lg bg-slate-900 text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-white/10">
              Julia - Assistante IA 🤖
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
            className="fixed bottom-8 left-8 z-50 w-[420px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-4rem)] rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col bg-slate-900"
            data-testid="chatbot-window"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-blue-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    Julia <Sparkles size={14} className="text-yellow-300" />
                  </h3>
                  <p className="text-xs text-white/70 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    Assistante IA Neuronova
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {currentView !== "chat" && (
                  <button
                    onClick={() => { setCurrentView("chat"); setSelectedServices([]); }}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors text-white/70"
                  >
                    <X size={16} />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  data-testid="chatbot-close"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto bg-slate-950">
              {/* Chat Messages */}
              {(currentView === "chat" || currentView === "collect-info" || currentView === "quiz") && (
                <div className="p-4 space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[85%]`}>
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            message.type === "user"
                              ? "bg-primary text-white rounded-br-sm"
                              : message.isQuote
                              ? "bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-500/30 text-white rounded-bl-sm"
                              : "bg-slate-800 text-white rounded-bl-sm"
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                        </div>
                        
                        {message.options && (
                          <div className="mt-2 space-y-2">
                            {message.options.map((option, i) => (
                              <motion.button
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => handleOptionClick(option)}
                                className="w-full text-left px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm text-white border border-white/10 hover:border-primary/50 transition-all flex items-center justify-between group"
                              >
                                {option.text}
                                <ChevronRight size={16} className="text-slate-500 group-hover:text-primary transition-colors" />
                              </motion.button>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-3">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                              className="w-2 h-2 rounded-full bg-primary"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* Quote Builder View */}
              {currentView === "quote" && (
                <div className="p-4">
                  <div className="space-y-4">
                    {Object.entries(SERVICES_DB).map(([catId, category]) => (
                      <div key={catId} className="rounded-xl border border-white/10 overflow-hidden">
                        <div className="bg-slate-800 px-4 py-3">
                          <h4 className="font-semibold text-white text-sm">{category.name}</h4>
                        </div>
                        <div className="p-2 space-y-1">
                          {category.services.map((service) => {
                            const isSelected = selectedServices.find(s => s.id === service.id);
                            return (
                              <button
                                key={service.id}
                                onClick={() => toggleService(service)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${
                                  isSelected 
                                    ? "bg-primary/20 border border-primary/50 text-white" 
                                    : "hover:bg-slate-800 text-slate-300"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                                    isSelected ? "bg-primary border-primary" : "border-slate-600"
                                  }`}>
                                    {isSelected && <Check size={12} className="text-white" />}
                                  </div>
                                  <span className="truncate">{service.name}</span>
                                </div>
                                <span className="text-xs text-primary font-medium">{service.price_usd}$</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Floating Total */}
                  {selectedServices.length > 0 && (
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="sticky bottom-0 mt-4 p-4 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-xs text-slate-400">{selectedServices.length} service(s)</p>
                          <p className="text-xl font-bold text-white">{getTotalUSD()}$</p>
                          <p className="text-xs text-slate-400">{getTotalFC().toLocaleString()} FC</p>
                        </div>
                        <Button 
                          onClick={confirmQuote}
                          className="bg-primary hover:bg-primary/90 h-10 px-4"
                        >
                          <ShoppingCart size={16} className="mr-2" />
                          Valider
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Services View */}
              {currentView === "services" && (
                <div className="p-4 space-y-4">
                  <div className="text-center mb-4">
                    <p className="text-slate-400 text-sm">Nos packs populaires 🔥</p>
                  </div>
                  {PACKS.map((pack) => (
                    <motion.div
                      key={pack.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl border border-white/10 bg-slate-800/50 hover:border-primary/50 transition-all"
                    >
                      <h4 className="font-semibold text-white mb-1">{pack.name}</h4>
                      <p className="text-xs text-slate-400 mb-3">{pack.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-primary">{pack.price_usd}$</span>
                          <span className="text-xs text-slate-400 ml-2">({pack.price_fc.toLocaleString()} FC)</span>
                          <span className="block text-xs text-green-400">Économie: {pack.savings}$</span>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => handleOptionClick({ text: pack.name, action: "pack", data: pack })}
                          className="bg-primary/20 hover:bg-primary text-primary hover:text-white"
                        >
                          Choisir
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleOptionClick({ text: "Créer devis personnalisé", action: "quote" })}
                  >
                    <Calculator size={16} className="mr-2" />
                    Devis personnalisé
                  </Button>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-slate-900">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder={currentView === "collect-info" ? "Tape ta réponse..." : "Message..."}
                  className="flex-1 bg-slate-800 border-white/10 h-11 rounded-xl"
                  data-testid="chatbot-input"
                />
                <Button onClick={handleSend} className="w-11 h-11 rounded-xl bg-primary p-0">
                  <Send size={18} />
                </Button>
              </div>
              <div className="flex items-center justify-center gap-4 mt-3">
                <button 
                  onClick={() => window.open("https://wa.me/243846378116", "_blank")}
                  className="text-xs text-slate-500 hover:text-green-500 transition-colors flex items-center gap-1"
                >
                  <Phone size={12} /> WhatsApp
                </button>
                <button 
                  onClick={() => window.open("mailto:serviceneuronova@gmail.com", "_blank")}
                  className="text-xs text-slate-500 hover:text-primary transition-colors flex items-center gap-1"
                >
                  <Mail size={12} /> Email
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
