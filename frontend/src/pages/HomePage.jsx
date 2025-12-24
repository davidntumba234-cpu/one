import { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ChevronDown, Globe, Bot, Cpu, Shield, Palette, Rocket,
  Code, Smartphone, ShoppingCart, Calendar, Building2, Plug, Server, Clock,
  Brain, MessageSquare, LineChart, FileSearch, Mic, Cog, Wifi,
  Lock, Search, Key, Database, Eye, AlertTriangle,
  PenTool, Video, Image, FileText, Camera, Sparkles,
  Users, Target, Lightbulb, BookOpen, TrendingUp, Presentation,
  Watch, Layers, Factory, TestTube, Truck, Home,
  Send, Loader2, MapPin, Phone, Mail, Star, CheckCircle2,
  Quote, ChevronRight, Plus, Minus, Play
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Logo URL from uploaded assets
const NEURONOVA_LOGO = "https://customer-assets.emergentagent.com/job_029cb03c-63b5-427f-af8c-afed8e65308a/artifacts/1rt013g6_file_00000000871c71f79e6e1c736e9fbdf8.png";
const DAVID_PHOTO = "https://customer-assets.emergentagent.com/job_029cb03c-63b5-427f-af8c-afed8e65308a/artifacts/vsh74s0h_1755110751779.jpg";

// Services data with 60+ services in 6 categories
const serviceCategories = [
  {
    id: "web",
    name: "Développement Web & Mobile",
    icon: Globe,
    color: "from-blue-500 to-cyan-400",
    image: "https://images.unsplash.com/photo-1531482984755-b51a25295306?auto=format&fit=crop&w=800&q=80",
    services: [
      { icon: Globe, name: "Sites vitrines", desc: "Présence en ligne professionnelle" },
      { icon: Code, name: "Applications web", desc: "Solutions sur mesure" },
      { icon: Smartphone, name: "Apps mobiles iOS/Android", desc: "Applications natives et hybrides" },
      { icon: ShoppingCart, name: "Sites e-commerce", desc: "Boutiques en ligne performantes" },
      { icon: Calendar, name: "Systèmes de réservation", desc: "Gestion de rendez-vous" },
      { icon: Building2, name: "Portails d'entreprise", desc: "Intranets et extranets" },
      { icon: Plug, name: "Intégration API", desc: "Connexion de services" },
      { icon: Server, name: "Hébergement & domaine", desc: "Infrastructure fiable" },
      { icon: Clock, name: "Maintenance & mises à jour", desc: "Support continu" },
      { icon: Target, name: "Landing pages optimisées", desc: "Pages de conversion" },
    ]
  },
  {
    id: "ai",
    name: "Intelligence Artificielle",
    icon: Bot,
    color: "from-purple-500 to-pink-400",
    image: "https://images.unsplash.com/photo-1760629863094-5b1e8d1aae74?auto=format&fit=crop&w=800&q=80",
    services: [
      { icon: MessageSquare, name: "Chatbots intelligents", desc: "Agents conversationnels 24/7" },
      { icon: Smartphone, name: "IA WhatsApp pro", desc: "Automatisation WhatsApp" },
      { icon: Brain, name: "Outils IA personnalisés", desc: "Solutions sur mesure" },
      { icon: LineChart, name: "Analyse prédictive", desc: "Prévisions ventes et stocks" },
      { icon: Star, name: "Systèmes de recommandation", desc: "Suggestions intelligentes" },
      { icon: FileSearch, name: "OCR & reconnaissance", desc: "Lecture de documents" },
      { icon: Mic, name: "IA vocale TTS/STT", desc: "Synthèse et reconnaissance" },
      { icon: Cog, name: "Automatisation RPA", desc: "Tâches répétitives" },
      { icon: Wifi, name: "IA embarquée IoT", desc: "Objets connectés intelligents" },
      { icon: Bot, name: "Intégration GPT", desc: "ChatGPT pour vos apps" },
    ]
  },
  {
    id: "security",
    name: "Cybersécurité",
    icon: Shield,
    color: "from-green-500 to-emerald-400",
    image: "https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=800",
    services: [
      { icon: Server, name: "Sécurisation serveurs", desc: "Protection infrastructure" },
      { icon: Search, name: "Audit de sécurité", desc: "Évaluation des risques" },
      { icon: Lock, name: "Solutions VPN pro", desc: "Connexions sécurisées" },
      { icon: Eye, name: "Détection d'intrusion", desc: "Surveillance en temps réel" },
      { icon: Database, name: "Sauvegarde cloud", desc: "Backup sécurisé" },
      { icon: Key, name: "Gestion des accès", desc: "Contrôle des permissions" },
      { icon: AlertTriangle, name: "Protection ransomware", desc: "Défense contre menaces" },
      { icon: Mail, name: "Anti-phishing", desc: "Formation et protection" },
      { icon: Lock, name: "Cryptage de données", desc: "Chiffrement avancé" },
      { icon: Clock, name: "Surveillance 24/7", desc: "Monitoring continu" },
    ]
  },
  {
    id: "design",
    name: "Création Digitale & Branding",
    icon: Palette,
    color: "from-orange-500 to-amber-400",
    image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800",
    services: [
      { icon: PenTool, name: "Design de logos", desc: "Identité visuelle unique" },
      { icon: Palette, name: "Identité visuelle", desc: "Charte graphique complète" },
      { icon: Video, name: "Vidéos entreprise", desc: "Présentations corporate" },
      { icon: Image, name: "Affiches pro", desc: "Supports marketing" },
      { icon: Sparkles, name: "Montages réseaux", desc: "Contenus sociaux" },
      { icon: Layers, name: "Branding produits", desc: "Packaging tech" },
      { icon: FileText, name: "Templates pitch deck", desc: "Présentations PowerPoint" },
      { icon: Video, name: "Contenus animés", desc: "Pub digitale" },
      { icon: Camera, name: "Photographie corporate", desc: "Shooting professionnel" },
      { icon: Sparkles, name: "Motion design", desc: "Animations créatives" },
    ]
  },
  {
    id: "consulting",
    name: "Consulting & Coaching",
    icon: Rocket,
    color: "from-red-500 to-rose-400",
    image: "https://images.unsplash.com/photo-1573757056004-065ad36e2cf4?auto=format&fit=crop&w=800&q=80",
    services: [
      { icon: TrendingUp, name: "Transformation digitale", desc: "Accompagnement complet" },
      { icon: Rocket, name: "Coaching entrepreneurial", desc: "Mentorat tech" },
      { icon: Target, name: "Stratégie digitale PME", desc: "Plans d'action" },
      { icon: Lightbulb, name: "Lancement startup", desc: "De l'idée au produit" },
      { icon: Cog, name: "Innovation produit", desc: "R&D et conception" },
      { icon: LineChart, name: "Étude marché tech", desc: "Analyse Afrique" },
      { icon: TrendingUp, name: "Levée de fonds", desc: "Planification investissement" },
      { icon: Building2, name: "Business model SaaS", desc: "Modèles économiques" },
      { icon: Users, name: "Organisation agile", desc: "Méthodes de travail" },
      { icon: BookOpen, name: "Formations tech", desc: "Online et présentiel" },
    ]
  },
  {
    id: "iot",
    name: "Objets Connectés & Gadgets",
    icon: Cpu,
    color: "from-cyan-500 to-blue-400",
    image: "https://images.pexels.com/photos/8294566/pexels-photo-8294566.jpeg?auto=compress&cs=tinysrgb&w=800",
    services: [
      { icon: Watch, name: "Montres intelligentes", desc: "Conception wearables" },
      { icon: Cpu, name: "Prototypes gadgets", desc: "Développement hardware" },
      { icon: Layers, name: "Design industriel", desc: "Produits tech" },
      { icon: TestTube, name: "Test & validation", desc: "Contrôle qualité" },
      { icon: Factory, name: "Fabrication locale", desc: "Made in RDC" },
      { icon: Truck, name: "Distribution gadgets", desc: "Logistique" },
      { icon: Brain, name: "Wearables IA", desc: "Accessoires intelligents" },
      { icon: Home, name: "Smart home", desc: "Domotique" },
      { icon: Wifi, name: "Solutions IoT", desc: "Entreprises connectées" },
      { icon: Cpu, name: "Agriculture intelligente", desc: "AgriTech" },
    ]
  },
];

// Stats
const stats = [
  { value: "60+", label: "Services" },
  { value: "50+", label: "Clients" },
  { value: "100+", label: "Projets" },
  { value: "30", label: "Pays" },
];

// Values
const values = [
  { icon: Lightbulb, title: "Innovation audacieuse", desc: "Repousser les limites de la technologie" },
  { icon: Globe, title: "Souveraineté africaine", desc: "Tech 100% Made in Africa" },
  { icon: Star, title: "Excellence", desc: "Précision et qualité dans chaque projet" },
  { icon: Shield, title: "Éthique", desc: "Responsabilité numérique" },
  { icon: BookOpen, title: "Formation", desc: "Partage du savoir" },
  { icon: Rocket, title: "Ambition mondiale", desc: "Ancrage local, vision globale" },
];

// Testimonials
const testimonials = [
  {
    id: 1,
    name: "Marie Kabongo",
    company: "TechStart RDC",
    role: "CEO",
    content: "Neuronova a transformé notre présence digitale. Leur équipe a développé un site e-commerce qui a triplé nos ventes en 6 mois. Professionnalisme et créativité au rendez-vous !",
    rating: 5,
    image: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150"
  },
  {
    id: 2,
    name: "Patrick Mukendi",
    company: "FinanceHub Africa",
    role: "Directeur Technique",
    content: "L'agent IA développé par Neuronova a révolutionné notre service client. Réponses instantanées 24/7, nos clients sont ravis et notre équipe peut se concentrer sur les cas complexes.",
    rating: 5,
    image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150"
  },
  {
    id: 3,
    name: "Sophie Ilunga",
    company: "EcoVert Kinshasa",
    role: "Fondatrice",
    content: "Excellente collaboration sur notre identité visuelle complète. Le branding est moderne et reflète parfaitement nos valeurs environnementales. Je recommande vivement !",
    rating: 5,
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150"
  },
  {
    id: 4,
    name: "Jean-Baptiste Lumumba",
    company: "SecureBank Congo",
    role: "CISO",
    content: "L'audit cybersécurité de Neuronova a identifié des failles critiques que nous ignorions. Leur expertise nous a permis de renforcer significativement notre infrastructure.",
    rating: 5,
    image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150"
  },
];

// FAQ Data
const faqData = [
  {
    question: "Quels types de services proposez-vous ?",
    answer: "Nous proposons plus de 60 services répartis en 6 catégories : Développement Web & Mobile, Intelligence Artificielle, Cybersécurité, Design & Branding, Consulting Tech, et Objets Connectés. Chaque service est personnalisable selon vos besoins spécifiques."
  },
  {
    question: "Combien coûte un projet avec Neuronova ?",
    answer: "Le coût varie selon la complexité du projet. Nous proposons des devis gratuits et personnalisés. Un site vitrine commence à partir de 500$, une application web sur mesure à partir de 2000$. Contactez-nous pour un devis détaillé."
  },
  {
    question: "Quel est le délai de réalisation d'un projet ?",
    answer: "Les délais dépendent du type de projet : un site vitrine peut être livré en 2-4 semaines, une application web en 2-3 mois, un projet d'IA en 1-3 mois. Nous établissons un planning détaillé dès le début du projet."
  },
  {
    question: "Proposez-vous un support après la livraison ?",
    answer: "Oui ! Nous offrons un support technique continu, des maintenances mensuelles, et des mises à jour régulières. Nos forfaits de maintenance commencent à partir de 100$/mois selon les besoins."
  },
  {
    question: "Travaillez-vous avec des clients hors de la RDC ?",
    answer: "Absolument ! Nous servons des clients dans plus de 30 pays africains. Nos équipes travaillent en remote et nous utilisons des outils de collaboration modernes pour assurer une communication fluide."
  },
  {
    question: "Comment se déroule un projet type ?",
    answer: "Notre processus comprend : 1) Consultation gratuite, 2) Proposition et devis, 3) Conception et validation, 4) Développement, 5) Tests et révisions, 6) Livraison et formation, 7) Support continu."
  },
];

// African Countries with flags (30 countries)
const africanCountries = [
  { name: "RD Congo", code: "CD", flag: "🇨🇩" },
  { name: "Nigeria", code: "NG", flag: "🇳🇬" },
  { name: "Afrique du Sud", code: "ZA", flag: "🇿🇦" },
  { name: "Kenya", code: "KE", flag: "🇰🇪" },
  { name: "Ghana", code: "GH", flag: "🇬🇭" },
  { name: "Tanzanie", code: "TZ", flag: "🇹🇿" },
  { name: "Éthiopie", code: "ET", flag: "🇪🇹" },
  { name: "Côte d'Ivoire", code: "CI", flag: "🇨🇮" },
  { name: "Cameroun", code: "CM", flag: "🇨🇲" },
  { name: "Sénégal", code: "SN", flag: "🇸🇳" },
  { name: "Maroc", code: "MA", flag: "🇲🇦" },
  { name: "Algérie", code: "DZ", flag: "🇩🇿" },
  { name: "Égypte", code: "EG", flag: "🇪🇬" },
  { name: "Tunisie", code: "TN", flag: "🇹🇳" },
  { name: "Rwanda", code: "RW", flag: "🇷🇼" },
  { name: "Ouganda", code: "UG", flag: "🇺🇬" },
  { name: "Angola", code: "AO", flag: "🇦🇴" },
  { name: "Mozambique", code: "MZ", flag: "🇲🇿" },
  { name: "Zimbabwe", code: "ZW", flag: "🇿🇼" },
  { name: "Zambie", code: "ZM", flag: "🇿🇲" },
  { name: "Mali", code: "ML", flag: "🇲🇱" },
  { name: "Burkina Faso", code: "BF", flag: "🇧🇫" },
  { name: "Niger", code: "NE", flag: "🇳🇪" },
  { name: "Bénin", code: "BJ", flag: "🇧🇯" },
  { name: "Togo", code: "TG", flag: "🇹🇬" },
  { name: "Gabon", code: "GA", flag: "🇬🇦" },
  { name: "Congo", code: "CG", flag: "🇨🇬" },
  { name: "Madagascar", code: "MG", flag: "🇲🇬" },
  { name: "Maurice", code: "MU", flag: "🇲🇺" },
  { name: "Botswana", code: "BW", flag: "🇧🇼" },
];

// Team members
const teamMembers = [
  {
    name: "Grace Mwamba",
    role: "Directrice Marketing",
    image: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    name: "Patrick Kasongo",
    role: "Lead Developer",
    image: "https://images.unsplash.com/photo-1675383094481-3e2088da943b?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Marie Ilunga",
    role: "UI/UX Designer",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    name: "Emmanuel Kabila",
    role: "Expert Cybersécurité",
    image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    name: "Sophie Lukusa",
    role: "Chef de Projet IA",
    image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    name: "Jean-Pierre Mulamba",
    role: "Ingénieur IoT",
    image: "https://images.unsplash.com/photo-1639472628910-ef02c5404b9c?auto=format&fit=crop&w=400&q=80",
  },
];

// Gallery images - Cinematic showcase
const galleryImages = [
  {
    url: "https://customer-assets.emergentagent.com/job_029cb03c-63b5-427f-af8c-afed8e65308a/artifacts/3ztmkhox_AI%20-%20Watch%20mockup.jpeg",
    title: "AI Smartwatch",
    category: "IoT & Gadgets"
  },
  {
    url: "https://customer-assets.emergentagent.com/job_029cb03c-63b5-427f-af8c-afed8e65308a/artifacts/3xngwtgf_Let%E2%80%99s%20Fuel%20Up%20Digitally%20with%20XSYNERGY%20%F0%9F%9A%80.jpeg",
    title: "Digital Transformation",
    category: "Consulting"
  },
  {
    url: "https://customer-assets.emergentagent.com/job_029cb03c-63b5-427f-af8c-afed8e65308a/artifacts/qpah6lby_Social%20media%20para%20Banco%20Digital___Gostou%20do%20resultado_%20Me%20conta%20nos%20coment%C3%A1rios%21__Link%20do%20projeto%20completo%20na%20bio%21__%23socialmedia%20%23socialmediapost%20%23banco%20%23bancodigital%20%23bank%20%23design%20%23graphicdesign%20%23postdesign%20%23brand%20%23.jpeg",
    title: "Digital Banking",
    category: "App Design"
  },
  {
    url: "https://customer-assets.emergentagent.com/job_029cb03c-63b5-427f-af8c-afed8e65308a/artifacts/klxn1ey4_Affiche%20de%20pub.jpeg",
    title: "CineFlex Streaming",
    category: "Mobile App"
  },
  {
    url: "https://customer-assets.emergentagent.com/job_029cb03c-63b5-427f-af8c-afed8e65308a/artifacts/q302dfe5_t%C3%A9l%C3%A9charger%20%281%29.jpeg",
    title: "WhatsApp Marketing",
    category: "Digital Marketing"
  },
  {
    url: "https://customer-assets.emergentagent.com/job_029cb03c-63b5-427f-af8c-afed8e65308a/artifacts/8meg5bvv_CODEVENOM%20Fullstack%20Development%20Wallpaper.jpeg",
    title: "Fullstack Development",
    category: "Web Dev"
  },
  {
    url: "https://customer-assets.emergentagent.com/job_029cb03c-63b5-427f-af8c-afed8e65308a/artifacts/uu60iigo_Cybersecurity%20solutions-Cybersecurity%20specialist-Cybersecurity%20consulting%20services_.jpeg",
    title: "Cybersecurity",
    category: "Security"
  },
  {
    url: "https://customer-assets.emergentagent.com/job_029cb03c-63b5-427f-af8c-afed8e65308a/artifacts/09k3qlsv_Adobe%20%F0%9F%92%BB.jpeg",
    title: "Adobe Creative Suite",
    category: "Design"
  },
  {
    url: "https://customer-assets.emergentagent.com/job_029cb03c-63b5-427f-af8c-afed8e65308a/artifacts/q62glo03_Cr%C3%A9ation%20Site%20Web%20Professionnel%20_%20E-commerce%20%26%20Comparateurs%20_%20Nova%20Impact.jpeg",
    title: "Web Creation",
    category: "E-commerce"
  },
];

// FAQ Item Component
function FAQItem({ faq, index }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="rounded-xl border border-white/10 overflow-hidden"
      data-testid={`faq-item-${index}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left bg-slate-900/50 hover:bg-slate-900/80 transition-colors"
      >
        <h3 className="text-lg font-medium text-white pr-4">{faq.question}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"
        >
          <Plus size={18} className="text-primary" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 bg-slate-900/30">
              <p className="text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("web");
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`${API}/contact`, contactForm);
      toast.success(response.data.message);
      setContactForm({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const activeServices = serviceCategories.find(cat => cat.id === activeCategory);

  return (
    <div className="min-h-screen noise-overlay" data-testid="home-page">
      {/* ==================== HERO SECTION - PREMIUM DIGITAL AGENCY ==================== */}
      <section 
        id="hero" 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        data-testid="hero-section"
      >
        {/* Deep dark background with gradient */}
        <div className="absolute inset-0 bg-[#030712]" />
        
        {/* Binary code pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='0' y='30' fill='%2338BDF8' font-family='monospace' font-size='10'%3E01001101%3C/text%3E%3Ctext x='0' y='50' fill='%2338BDF8' font-family='monospace' font-size='10'%3E10110010%3C/text%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
        </div>
        
        {/* Animated glow orbs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[150px]"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/15 blur-[120px]"
        />
        <motion.div 
          animate={{ 
            x: [-50, 50, -50],
            y: [-30, 30, -30]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/3 right-1/3 w-[300px] h-[300px] rounded-full bg-blue-600/10 blur-[100px]"
        />

        {/* Content */}
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <motion.div 
              style={{ opacity: heroOpacity }}
              className="text-left"
            >
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="mb-8"
              >
                <img 
                  src={NEURONOVA_LOGO} 
                  alt="Neuronova Logo" 
                  className="w-32 h-32 drop-shadow-2xl"
                  data-testid="hero-logo"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-sm font-medium mb-6 backdrop-blur-sm">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles size={16} />
                  </motion.span>
                  Digital Agency Premium • Kinshasa, RDC
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 leading-[0.9]"
                data-testid="hero-title"
              >
                NEURO
                <span className="block gradient-text">NOVA</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-xl md:text-2xl text-white/60 mb-2 font-light tracking-wide"
              >
                Tech. Intelligence. Afrique.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-sm uppercase tracking-[0.3em] text-primary/80 mb-8"
              >
                INNOVATE THE FUTURE
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="text-lg text-slate-400 max-w-lg mb-10 leading-relaxed"
              >
                Agence digitale premium spécialisée en IA, développement web, 
                cybersécurité et design. 60+ solutions technologiques pour 
                propulser votre entreprise.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-wrap gap-4"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                    className="btn-primary text-lg h-14 px-8"
                    data-testid="discover-btn"
                  >
                    Découvrir nos services
                    <ArrowRight size={20} className="ml-2" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="btn-secondary text-lg h-14 px-8"
                    data-testid="contact-btn"
                  >
                    Nous contacter
                  </Button>
                </motion.div>
              </motion.div>

              {/* Stats inline */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="flex gap-8 mt-12 pt-8 border-t border-white/10"
              >
                {stats.map((stat, i) => (
                  <motion.div 
                    key={i} 
                    className="text-left"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + i * 0.1 }}
                  >
                    <div className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</div>
                    <div className="text-slate-500 text-xs uppercase tracking-wider">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right side - Floating devices mockup */}
            <motion.div 
              className="relative hidden lg:block"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              {/* Main laptop/device showcase */}
              <div className="relative">
                {/* Glow behind devices */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl scale-90" />
                
                {/* Main showcase image */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                  <img 
                    src="https://customer-assets.emergentagent.com/job_029cb03c-63b5-427f-af8c-afed8e65308a/artifacts/3ztmkhox_AI%20-%20Watch%20mockup.jpeg"
                    alt="Premium Device Mockup"
                    className="w-full rounded-2xl shadow-2xl shadow-primary/20 border border-white/10"
                  />
                </motion.div>

                {/* Floating iPhone 1 */}
                <motion.div
                  animate={{ 
                    y: [-15, 15, -15],
                    rotate: [-5, 5, -5]
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -left-12 top-1/4 w-40"
                >
                  <img 
                    src="https://customer-assets.emergentagent.com/job_029cb03c-63b5-427f-af8c-afed8e65308a/artifacts/klxn1ey4_Affiche%20de%20pub.jpeg"
                    alt="Mobile App"
                    className="w-full rounded-xl shadow-xl shadow-black/50 border border-white/10"
                  />
                </motion.div>

                {/* Floating iPhone 2 */}
                <motion.div
                  animate={{ 
                    y: [15, -15, 15],
                    rotate: [5, -5, 5]
                  }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-8 bottom-1/4 w-36"
                >
                  <img 
                    src="https://customer-assets.emergentagent.com/job_029cb03c-63b5-427f-af8c-afed8e65308a/artifacts/qpah6lby_Social%20media%20para%20Banco%20Digital___Gostou%20do%20resultado_%20Me%20conta%20nos%20coment%C3%A1rios%21__Link%20do%20projeto%20completo%20na%20bio%21__%23socialmedia%20%23socialmediapost%20%23banco%20%23bancodigital%20%23bank%20%23design%20%23graphicdesign%20%23postdesign%20%23brand%20%23.jpeg"
                    alt="Banking App"
                    className="w-full rounded-xl shadow-xl shadow-black/50 border border-white/10"
                  />
                </motion.div>

                {/* Floating 3D icons */}
                <motion.div
                  animate={{ 
                    y: [-20, 20, -20],
                    x: [-10, 10, -10],
                    rotate: [0, 360]
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#31A8FF] to-[#001E36] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30"
                >
                  <span className="text-white font-bold text-xl">Ps</span>
                </motion.div>

                <motion.div
                  animate={{ 
                    y: [20, -20, 20],
                    x: [10, -10, 10],
                    rotate: [360, 0]
                  }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="absolute bottom-0 left-0 w-14 h-14 bg-gradient-to-br from-[#FF9A00] to-[#FF0000] rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30"
                >
                  <span className="text-white font-bold text-lg">Ai</span>
                </motion.div>

                <motion.div
                  animate={{ 
                    y: [-15, 15, -15],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1/2 -left-20 w-12 h-12 bg-gradient-to-br from-[#9999FF] to-[#2D0060] rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30"
                >
                  <span className="text-white font-bold text-sm">Ae</span>
                </motion.div>

                <motion.div
                  animate={{ 
                    y: [10, -10, 10],
                    rotate: [-10, 10, -10]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1/3 right-1/4 w-10 h-10 bg-gradient-to-br from-primary to-blue-700 rounded-lg flex items-center justify-center shadow-lg shadow-primary/30"
                >
                  <Code size={20} className="text-white" />
                </motion.div>

                {/* Glowing particles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      y: [Math.random() * 50 - 25, Math.random() * 50 - 25],
                      x: [Math.random() * 50 - 25, Math.random() * 50 - 25],
                      opacity: [0.3, 0.8, 0.3]
                    }}
                    transition={{ 
                      duration: 3 + Math.random() * 2, 
                      repeat: Infinity,
                      delay: i * 0.5
                    }}
                    className="absolute w-2 h-2 rounded-full bg-primary"
                    style={{
                      top: `${20 + i * 15}%`,
                      left: `${10 + i * 12}%`,
                      filter: 'blur(1px)'
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <button 
            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex flex-col items-center gap-2 text-slate-500 hover:text-primary transition-colors"
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown size={24} />
            </motion.div>
          </button>
        </motion.div>
      </section>

      {/* ==================== AVAILABILITY SECTION ==================== */}
      <section className="py-12 relative overflow-hidden">
        {/* Animated gradient background */}
        <motion.div 
          animate={{ 
            background: [
              "linear-gradient(90deg, rgba(56,189,248,0.1) 0%, rgba(245,158,11,0.05) 50%, rgba(56,189,248,0.1) 100%)",
              "linear-gradient(90deg, rgba(245,158,11,0.05) 0%, rgba(56,189,248,0.1) 50%, rgba(245,158,11,0.05) 100%)",
              "linear-gradient(90deg, rgba(56,189,248,0.1) 0%, rgba(245,158,11,0.05) 50%, rgba(56,189,248,0.1) 100%)"
            ]
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute inset-0"
        />
        <div className="absolute inset-0 border-y border-white/5" />
        
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <motion.div 
              className="flex items-center gap-4"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="relative">
                <div className="w-4 h-4 rounded-full bg-green-500" />
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 w-4 h-4 rounded-full bg-green-500"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Disponible 24/7</h3>
                <p className="text-slate-400 text-sm">Support et consultation disponibles</p>
              </div>
            </motion.div>
            <div className="flex items-center gap-6">
              {[
                { label: "Devis Gratuit" },
                { label: "Réponse 24h" },
                { label: "Projets Urgents" }
              ].map((item, i) => (
                <motion.div 
                  key={item.label}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-1" />
                  </motion.div>
                  <p className="text-slate-400 text-xs">{item.label}</p>
                </motion.div>
              ))}
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => window.open('https://wa.me/243846378116', '_blank')}
                className="bg-green-600 hover:bg-green-700 text-white h-12 px-8 rounded-full shadow-lg shadow-green-500/25"
                data-testid="availability-cta"
              >
                <Phone size={18} className="mr-2" />
                Appeler Maintenant
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ==================== SERVICES SECTION ==================== */}
      <section id="services" className="section-padding relative overflow-hidden" data-testid="services-section">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px]" />
          <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[120px]" />
        </div>
        
        {/* Floating particles */}
        <motion.div
          animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-primary/50"
        />
        <motion.div
          animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-1/3 right-1/3 w-3 h-3 rounded-full bg-accent/50"
        />
        <motion.div
          animate={{ y: [-15, 15, -15] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute bottom-1/4 left-1/3 w-2 h-2 rounded-full bg-primary/30"
        />
        
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span 
              className="subheading"
              initial={{ opacity: 0, letterSpacing: "0.5em" }}
              whileInView={{ opacity: 1, letterSpacing: "0.2em" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Nos Services
            </motion.span>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              60+ Solutions <span className="gradient-text">Technologiques</span>
            </h2>
            <p className="paragraph max-w-3xl mx-auto">
              De la création web à l'intelligence artificielle, nous offrons une gamme complète 
              de services pour transformer votre vision en réalité numérique.
            </p>
          </motion.div>

          {/* Category Tabs with animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {serviceCategories.map((cat, i) => (
              <motion.button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`category-tab flex items-center gap-2 ${activeCategory === cat.id ? 'active' : ''}`}
                data-testid={`category-${cat.id}`}
              >
                <cat.icon size={18} />
                <span className="hidden sm:inline">{cat.name}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Services Grid with Image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Category Image with parallax effect */}
              <motion.div 
                className="lg:col-span-1"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="rounded-2xl overflow-hidden border border-white/10 h-full relative group">
                  <img 
                    src={activeServices?.image} 
                    alt={activeServices?.name}
                    className="w-full h-full object-cover min-h-[300px] transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-2xl font-bold text-white">{activeServices?.name}</h3>
                      <p className="text-primary text-sm mt-1">10 services disponibles</p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
              
              {/* Services List with stagger animation */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeServices?.services.map((service, i) => (
                  <motion.div
                    key={service.name}
                    initial={{ opacity: 0, y: 30, rotateX: -15 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="service-card p-5 group cursor-pointer flex items-start gap-4"
                    data-testid={`service-${i}`}
                  >
                    <motion.div 
                      className={`service-icon w-10 h-10 rounded-xl bg-gradient-to-br ${activeServices.color} bg-opacity-20 flex items-center justify-center flex-shrink-0 text-white/80`}
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      <service.icon size={20} />
                    </motion.div>
                    <div>
                      <h4 className="font-semibold text-white mb-1 group-hover:text-primary transition-colors">
                        {service.name}
                      </h4>
                      <p className="text-slate-400 text-sm">{service.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ==================== GALLERY SECTION - CINEMATIC ==================== */}
      <section className="py-24 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/10 blur-[120px]" />
        
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="subheading">Portfolio</span>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
              L'Innovation en <span className="gradient-text">Images</span>
            </h2>
            <p className="paragraph max-w-2xl mx-auto">
              Découvrez nos réalisations et notre vision du futur digital
            </p>
          </motion.div>
          
          {/* Cinematic Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50, rotateX: -10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
                whileHover={{ scale: 1.02, y: -10 }}
                className="relative group cursor-pointer"
              >
                {/* Card with glow */}
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-900/50 backdrop-blur-sm group-hover:border-primary/50 transition-all duration-500">
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                  
                  {/* Image */}
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={img.url} 
                      alt={img.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  
                  {/* Overlay with info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-20">
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {img.category}
                      </span>
                      <h4 className="text-xl font-bold text-white">{img.title}</h4>
                    </div>
                  </div>
                </div>
                
                {/* Shadow glow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-500 -z-10" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== HISTOIRE SECTION ==================== */}
      <section id="histoire" className="section-padding" data-testid="histoire-section">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="subheading">Notre Histoire</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                Naissance d'un <span className="gradient-text">Empire Tech</span> Africain
              </h2>
              <div className="space-y-6 paragraph">
                <p>
                  Fondée en <span className="text-primary font-semibold">2025 à Kinshasa</span> par{" "}
                  <span className="text-white">David Ntumba</span> et{" "}
                  <span className="text-white">Jordan Leko</span>, NEURONOVA est née de la volonté 
                  de bâtir un empire technologique africain.
                </p>
                <p>
                  L'entreprise a commencé avec une idée simple : utiliser l'intelligence artificielle 
                  et la technologie pour propulser les entreprises locales vers l'innovation mondiale.
                </p>
                <p>
                  Aujourd'hui, NEURONOVA est un acteur visionnaire dans la transformation digitale 
                  en RDC et en Afrique, avec plus de <span className="text-primary font-semibold">60 services</span>{" "}
                  et <span className="text-primary font-semibold">100+ projets réalisés</span>.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden border border-white/10">
                <img 
                  src="https://images.pexels.com/photos/9536008/pexels-photo-9536008.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Neuronova Team"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 p-6 rounded-2xl glass border border-white/10">
                <img src={NEURONOVA_LOGO} alt="Logo" className="w-16 h-16 mb-2" />
                <div className="text-white font-bold">Est. 2025</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== MISSION / VISION / VALUES SECTION ==================== */}
      <section id="mission" className="section-padding bg-slate-950/50" data-testid="mission-section">
        <div className="container-custom">
          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-10 rounded-3xl glass border border-primary/20"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Target size={32} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Notre Mission</h3>
              <p className="text-slate-300 text-lg leading-relaxed">
                Offrir aux entreprises africaines les outils technologiques les plus puissants 
                et accessibles pour les aider à <span className="text-primary">automatiser</span>, 
                <span className="text-primary"> innover</span> et <span className="text-primary">conquérir</span> leurs marchés.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-10 rounded-3xl glass border border-accent/20"
            >
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                <Eye size={32} className="text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Notre Vision</h3>
              <p className="text-slate-300 text-lg leading-relaxed">
                Devenir d'ici <span className="text-accent font-bold">2030</span> la référence technologique 
                <span className="text-accent"> numéro 1 en Afrique</span>, bâtissant un écosystème de solutions 
                digitales, d'IA et d'objets connectés <span className="text-accent">"Made in Africa"</span>.
              </p>
            </motion.div>
          </div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="subheading">Nos Valeurs</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Ce Qui Nous <span className="gradient-text">Guide</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="value-card text-center"
                data-testid={`value-${i}`}
              >
                <div className="value-icon w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <value.icon size={28} className="text-primary" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-3">{value.title}</h4>
                <p className="text-slate-400">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== AFRICAN COUNTRIES SECTION ==================== */}
      <section id="pays" className="section-padding" data-testid="countries-section">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="subheading">Présence Africaine</span>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Nous Servons <span className="gradient-text">30 Pays</span> Africains
            </h2>
            <p className="paragraph max-w-3xl mx-auto">
              Notre ambition est de couvrir tout le continent africain avec nos solutions technologiques.
            </p>
          </motion.div>

          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-4">
            {africanCountries.map((country, i) => (
              <motion.div
                key={country.code}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.02 }}
                className="p-4 rounded-xl border border-white/5 bg-slate-900/30 text-center hover:border-primary/30 hover:bg-primary/5 transition-all group cursor-pointer"
                data-testid={`country-${country.code}`}
              >
                <span className="text-3xl md:text-4xl block mb-2">{country.flag}</span>
                <span className="text-xs text-slate-400 group-hover:text-white transition-colors">{country.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FOUNDERS SECTION ==================== */}
      <section id="fondateurs" className="section-padding relative overflow-hidden" data-testid="founders-section">
        {/* Cinematic background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/5"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary/10"
        />
        
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.span 
              className="subheading"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              Les Fondateurs
            </motion.span>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Les Visionnaires de <span className="gradient-text">Neuronova</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 max-w-5xl mx-auto">
            {/* David Ntumba */}
            <motion.div
              initial={{ opacity: 0, x: -100, rotateY: -20 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="founder-card group"
              data-testid="founder-david"
            >
              <motion.div 
                className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-8 border border-white/10"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img 
                  src={DAVID_PHOTO}
                  alt="David Ntumba"
                  className="founder-image w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                
                {/* Animated glow */}
                <motion.div
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"
                />
                
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-primary text-sm font-medium mb-2">Co-Fondateur & CEO</p>
                    <h3 className="text-3xl font-bold text-white">David Ntumba</h3>
                  </motion.div>
                </div>
              </motion.div>
              <motion.p 
                className="text-slate-300 leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                Né le <span className="text-primary">22 mai 2006</span>, David est un visionnaire 
                à l'origine de Neuronova. Spécialiste en entrepreneuriat, marketing digital et 
                stratégie de croissance, il est le moteur derrière la mission de l'entreprise 
                de révolutionner le paysage tech africain.
              </motion.p>
            </motion.div>

            {/* Jordan Leko */}
            <motion.div
              initial={{ opacity: 0, x: 100, rotateY: 20 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="founder-card group"
              data-testid="founder-jordan"
            >
              <motion.div 
                className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-8 border border-white/10"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img 
                  src="https://images.pexels.com/photos/5060987/pexels-photo-5060987.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Jordan Leko"
                  className="founder-image w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                
                {/* Animated glow */}
                <motion.div
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                  className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent"
                />
                
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-accent text-sm font-medium mb-2">Co-Fondateur & CTO</p>
                    <h3 className="text-3xl font-bold text-white">Jordan Leko</h3>
                  </motion.div>
                </div>
              </motion.div>
              <motion.p 
                className="text-slate-300 leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                Expert en développement logiciel et innovation technologique, Jordan est passionné 
                par la <span className="text-accent">transformation digitale en Afrique</span>. 
                Avec plusieurs années d'expérience dans le développement de solutions tech, 
                il dirige la vision technique de Neuronova.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS SECTION ==================== */}
      <section id="testimonials" className="section-padding relative overflow-hidden" data-testid="testimonials-section">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[150px]" />
        
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="subheading">Témoignages</span>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ce Que Disent <span className="gradient-text">Nos Clients</span>
            </h2>
            <p className="paragraph max-w-2xl mx-auto">
              Découvrez les retours d'expérience de nos clients satisfaits à travers l'Afrique
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="relative p-8 rounded-2xl bg-slate-900/50 border border-white/10 hover:border-primary/30 transition-all group"
                data-testid={`testimonial-${i}`}
              >
                {/* Quote icon */}
                <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/20" />
                
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} size={16} className="text-accent fill-accent" />
                  ))}
                </div>
                
                {/* Content */}
                <p className="text-slate-300 leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>
                
                {/* Author */}
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
                  />
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-slate-400">{testimonial.role} • {testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary"
            >
              Rejoignez nos clients satisfaits
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ==================== FAQ SECTION ==================== */}
      <section id="faq" className="section-padding bg-slate-950/50" data-testid="faq-section">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="subheading">FAQ</span>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Questions <span className="gradient-text">Fréquentes</span>
            </h2>
            <p className="paragraph max-w-2xl mx-auto">
              Trouvez rapidement les réponses à vos questions
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqData.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-slate-400 mb-4">Vous avez d'autres questions ?</p>
            <Button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              variant="outline"
              className="btn-secondary"
            >
              Contactez-nous
              <ChevronRight size={18} className="ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ==================== CONTACT SECTION ==================== */}
      <section id="contact" className="section-padding bg-slate-950/50" data-testid="contact-section">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="subheading">Contact</span>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Parlons de Votre <span className="gradient-text">Projet</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 md:p-10 rounded-3xl glass border border-white/10"
            >
              <h3 className="text-2xl font-bold text-white mb-8">Envoyez-nous un message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-300">Nom complet *</Label>
                    <Input
                      id="name"
                      placeholder="Votre nom"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="form-input"
                      data-testid="contact-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-300">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="form-input"
                      data-testid="contact-email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-300">Téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+243 XXX XXX XXX"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="form-input"
                    data-testid="contact-phone"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-slate-300">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Décrivez votre projet..."
                    rows={5}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="form-input resize-none"
                    data-testid="contact-message"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary"
                  data-testid="contact-submit"
                >
                  {isLoading ? (
                    <><Loader2 size={20} className="animate-spin mr-2" /> Envoi...</>
                  ) : (
                    <><Send size={20} className="mr-2" /> Envoyer le message</>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/50">
                  <MapPin size={24} className="text-primary mb-4" />
                  <h4 className="font-semibold text-white mb-2">Adresse</h4>
                  <p className="text-slate-400 text-sm">Avenue Colonel Ebeya, Gombe, Kinshasa, RDC</p>
                </div>
                <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/50">
                  <Phone size={24} className="text-primary mb-4" />
                  <h4 className="font-semibold text-white mb-2">Téléphone</h4>
                  <a href="tel:+243846378116" className="text-slate-400 text-sm hover:text-primary transition-colors">
                    +243 846 378 116
                  </a>
                </div>
                <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/50">
                  <Mail size={24} className="text-primary mb-4" />
                  <h4 className="font-semibold text-white mb-2">Email</h4>
                  <a href="mailto:contact@neuronova.com" className="text-slate-400 text-sm hover:text-primary transition-colors">
                    contact@neuronova.com
                  </a>
                </div>
                <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/50">
                  <Clock size={24} className="text-primary mb-4" />
                  <h4 className="font-semibold text-white mb-2">Horaires</h4>
                  <p className="text-slate-400 text-sm">Lun - Ven: 8h00 - 18h00</p>
                </div>
              </div>

              {/* Map */}
              <div className="rounded-2xl overflow-hidden border border-white/10 h-[250px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3978.5!2d15.3!3d-4.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKinshasa!5e0!3m2!1sfr!2scd!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Localisation Neuronova"
                  data-testid="google-map"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[150px]" />
        
        <div className="container-custom relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <img src={NEURONOVA_LOGO} alt="Neuronova" className="w-24 h-24 mx-auto mb-8" />
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Prêt à rejoindre la révolution <span className="gradient-text">tech africaine</span>?
            </h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Contactez-nous dès maintenant et transformons ensemble votre entreprise.
            </p>
            <Button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-gold text-lg"
              data-testid="final-cta"
            >
              Démarrer votre projet
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
