# Neuronova Website - Requirements & Architecture

## Original Problem Statement
Site web CINÉMATIQUE pour Neuronova, entreprise tech spécialisée - Style inspiré du site Nova One (ntumba-tech.preview.emergentagent.com)

**Tagline**: Tech. Intelligence. Afrique.

## Architecture Implemented

### Backend (FastAPI + MongoDB)
- `GET /api/health` - Health check
- `GET /api/services` - Liste des 6 catégories de services
- `GET /api/testimonials` - Témoignages clients
- `POST /api/contact` - Soumission formulaire contact
- `POST /api/quote` - Demande de devis

### Frontend (React + Framer Motion + Tailwind)
**Single-Page Application avec sections scrollables:**

1. **HERO** - Titre NEURONOVA avec parallax, tagline "Tech. Intelligence. Afrique.", stats animés (60+ services, 50+ clients, 100+ projets, 2025)

2. **SERVICES** - 60+ services en 6 catégories avec tabs:
   - Développement Web & Mobile (10 services)
   - Intelligence Artificielle (10 services)
   - Cybersécurité (10 services)
   - Création Digitale & Branding (10 services)
   - Consulting & Coaching (10 services)
   - Objets Connectés & Gadgets (10 services)

3. **HISTOIRE** - Fondée en 2025 à Kinshasa par David Ntumba et Jordan Leko

4. **MISSION** - Outils tech pour entreprises africaines

5. **VISION** - Référence tech #1 en Afrique d'ici 2030

6. **VALEURS** - 6 valeurs (Innovation, Souveraineté, Excellence, Éthique, Formation, Ambition mondiale)

7. **FONDATEURS** - David Ntumba (CEO) et Jordan Leko (CTO) avec photos grayscale qui deviennent couleur au hover

8. **CONTACT** - Formulaire + Google Maps + Coordonnées + WhatsApp

### Design System
- **Theme**: Dark mode cinématique (slate-950 background)
- **Colors**: Electric Blue (#38BDF8) + Gold/Amber (#F59E0B)
- **Fonts**: Clash Display (headings) + Manrope (body)
- **Effects**: Glassmorphism, parallax, glow effects, animations Framer Motion

## Tasks Completed
- [x] Hero cinématique avec parallax et animations
- [x] Navigation sticky avec smooth scroll
- [x] Services avec 60+ items en 6 catégories tabulées
- [x] Section Histoire de l'entreprise
- [x] Cards Mission et Vision
- [x] 6 Valeurs avec icônes
- [x] Section Fondateurs avec photos grayscale
- [x] Formulaire de contact fonctionnel
- [x] WhatsApp flottant (+243 846 378 116)
- [x] Google Maps intégré
- [x] Footer complet
- [x] Design responsive mobile

## Next Tasks
- [ ] Ajouter clé SendGrid pour emails (SENDGRID_API_KEY dans backend/.env)
- [ ] Ajouter vraies photos des fondateurs David Ntumba et Jordan Leko
- [ ] Ajouter vrais liens réseaux sociaux
- [ ] Section Blog/Actualités (optionnel)
- [ ] Section FAQ (optionnel)
- [ ] Animations de compteur pour les stats
- [ ] Mode précommande pour produits/services premium
