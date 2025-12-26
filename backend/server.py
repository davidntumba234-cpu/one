from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone

# SendGrid imports
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Neuronova API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============== SERVICES DATABASE ==============
SERVICES_DATABASE = {
    "creation": {
        "name": "Création & Développement",
        "services": [
            {"id": "site-vitrine", "name": "Site vitrine simple (1-5 pages)", "price_usd": 400, "price_fc": 880000},
            {"id": "site-pro", "name": "Site pro complet (5-10 pages)", "price_usd": 800, "price_fc": 1760000},
            {"id": "ecommerce", "name": "E-commerce (avec paiement)", "price_usd": 1300, "price_fc": 2860000},
            {"id": "app-mobile", "name": "Application mobile (Android/iOS)", "price_usd": 2000, "price_fc": 4400000},
            {"id": "app-web", "name": "Application web", "price_usd": 1000, "price_fc": 2200000},
            {"id": "maintenance", "name": "Maintenance site mensuelle", "price_usd": 50, "price_fc": 110000},
            {"id": "refonte", "name": "Mise à jour & refonte", "price_usd": 100, "price_fc": 220000},
        ]
    },
    "ai": {
        "name": "Intelligence Artificielle & Automatisation",
        "services": [
            {"id": "agent-ai", "name": "Agent AI (WhatsApp, Web, etc.)", "price_usd": 250, "price_fc": 550000},
            {"id": "generateur-devis", "name": "Générateur automatique de devis", "price_usd": 150, "price_fc": 330000},
            {"id": "integration-ia", "name": "Intégration IA sur site", "price_usd": 200, "price_fc": 440000},
            {"id": "agent-julia", "name": "Agent Julia personnalisé (chatbot avancé)", "price_usd": 300, "price_fc": 660000},
            {"id": "automatisation", "name": "Automatisation des tâches récurrentes", "price_usd": 180, "price_fc": 396000},
        ]
    },
    "design": {
        "name": "Design & Contenu Visuel",
        "services": [
            {"id": "logo", "name": "Logo professionnel", "price_usd": 50, "price_fc": 110000},
            {"id": "identite-visuelle", "name": "Identité visuelle complète", "price_usd": 120, "price_fc": 264000},
            {"id": "affiche", "name": "Affiche/flyer pro", "price_usd": 30, "price_fc": 66000},
            {"id": "video-promo", "name": "Vidéo promotionnelle", "price_usd": 100, "price_fc": 220000},
            {"id": "powerpoint", "name": "Présentation PowerPoint pro", "price_usd": 40, "price_fc": 88000},
            {"id": "motion-design", "name": "Vidéo animée/motion design", "price_usd": 90, "price_fc": 198000},
            {"id": "montage-video", "name": "Montage vidéo photo événementielle", "price_usd": 80, "price_fc": 176000},
        ]
    },
    "security": {
        "name": "Sécurité, Cloud & Hébergement",
        "services": [
            {"id": "hebergement", "name": "Hébergement cloud (mensuel)", "price_usd": 25, "price_fc": 55000},
            {"id": "ssl", "name": "Sécurisation site / installation SSL", "price_usd": 30, "price_fc": 66000},
            {"id": "firewall", "name": "Firewall & protection cyber", "price_usd": 150, "price_fc": 330000},
            {"id": "monitoring", "name": "Monitoring & sauvegarde", "price_usd": 60, "price_fc": 132000},
        ]
    },
    "business": {
        "name": "Entrepreneuriat & Business",
        "services": [
            {"id": "business-plan", "name": "Création de business plan", "price_usd": 500, "price_fc": 1100000},
            {"id": "creation-entreprise", "name": "Accompagnement création d'entreprise", "price_usd": 200, "price_fc": 440000},
            {"id": "coaching", "name": "Coaching entrepreneurial (par séance)", "price_usd": 40, "price_fc": 88000},
            {"id": "formation", "name": "Formation entrepreneuriale (pack)", "price_usd": 150, "price_fc": 330000},
            {"id": "diagnostic", "name": "Diagnostic d'entreprise numérique", "price_usd": 70, "price_fc": 154000},
            {"id": "levee-fonds", "name": "Préparation à la levée de fonds", "price_usd": 150, "price_fc": 330000},
            {"id": "pitch-deck", "name": "Élaboration de pitch deck", "price_usd": 60, "price_fc": 132000},
            {"id": "mentorat", "name": "Mentorat 1 mois", "price_usd": 150, "price_fc": 330000},
        ]
    },
    "innovation": {
        "name": "Prototypage & Innovation",
        "services": [
            {"id": "prototype-gadget", "name": "Conception de prototype de gadget", "price_usd": 500, "price_fc": 1100000},
            {"id": "fabrication-prototype", "name": "Fabrication de prototype tech simple", "price_usd": 800, "price_fc": 1760000},
            {"id": "prototype-ai-iot", "name": "Prototype AI ou IoT", "price_usd": 600, "price_fc": 1320000},
        ]
    }
}

PACKS = [
    {
        "id": "pack-lancement",
        "name": "Pack Lancement d'Entreprise",
        "description": "Idéal pour démarrer votre activité",
        "services": ["logo", "site-vitrine", "business-plan", "powerpoint", "coaching"],
        "price_usd": 370,
        "price_fc": 814000,
        "savings": "Économie de 260$"
    },
    {
        "id": "pack-digitalisation",
        "name": "Pack Digitalisation PME",
        "description": "Transformez digitalement votre entreprise",
        "services": ["site-pro", "agent-ai", "hebergement", "ssl", "diagnostic", "formation"],
        "price_usd": 1200,
        "price_fc": 2640000,
        "savings": "Économie de 255$"
    },
    {
        "id": "pack-createur",
        "name": "Pack Créateur de Contenu",
        "description": "Boostez votre image de marque",
        "services": ["identite-visuelle", "video-promo", "affiche", "montage-video"],
        "price_usd": 300,
        "price_fc": 660000,
        "savings": "Économie de 100$"
    }
]

# ============== MODELS ==============

class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str

class QuoteRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    client_email: Optional[str] = None
    client_phone: Optional[str] = None
    company_name: Optional[str] = None
    services: List[str]
    total_usd: float
    total_fc: float
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class QuoteRequestCreate(BaseModel):
    client_name: str
    client_email: Optional[str] = None
    client_phone: Optional[str] = None
    company_name: Optional[str] = None
    services: List[str]
    total_usd: float
    total_fc: float
    notes: Optional[str] = None

class Testimonial(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    company: str
    content: str
    rating: int = Field(ge=1, le=5)
    image_url: Optional[str] = None

# ============== EMAIL SERVICE ==============

def send_notification_email(to_email: str, subject: str, content: str):
    """Send email notification via SendGrid"""
    sendgrid_api_key = os.environ.get('SENDGRID_API_KEY')
    sender_email = os.environ.get('SENDER_EMAIL', 'noreply@neuronova.com')
    
    if not sendgrid_api_key:
        logger.warning("SendGrid API key not configured, skipping email")
        return False
    
    message = Mail(
        from_email=sender_email,
        to_emails=to_email,
        subject=subject,
        html_content=content
    )
    
    try:
        sg = SendGridAPIClient(sendgrid_api_key)
        response = sg.send(message)
        logger.info(f"Email sent successfully: {response.status_code}")
        return response.status_code == 202
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        return False

def send_contact_notification(contact: ContactMessage):
    """Send notification email for new contact message"""
    admin_email = os.environ.get('ADMIN_EMAIL', 'serviceneuronova@gmail.com')
    subject = f"Nouveau message de contact - {contact.name}"
    content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #38BDF8;">Nouveau Message de Contact</h2>
            <p><strong>Nom:</strong> {contact.name}</p>
            <p><strong>Email:</strong> {contact.email}</p>
            <p><strong>Téléphone:</strong> {contact.phone or 'Non fourni'}</p>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-top: 15px;">
                <strong>Message:</strong>
                <p>{contact.message}</p>
            </div>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
                Reçu le {contact.created_at.strftime('%d/%m/%Y à %H:%M')}
            </p>
        </body>
    </html>
    """
    send_notification_email(admin_email, subject, content)

def send_quote_notification(quote: QuoteRequest):
    """Send notification email for new quote request"""
    admin_email = os.environ.get('ADMIN_EMAIL', 'serviceneuronova@gmail.com')
    subject = f"Nouvelle demande de devis - {quote.client_name}"
    services_list = "<br>".join([f"• {s}" for s in quote.services])
    content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #F59E0B;">Nouvelle Demande de Devis</h2>
            <p><strong>Client:</strong> {quote.client_name}</p>
            <p><strong>Entreprise:</strong> {quote.company_name or 'Non spécifié'}</p>
            <p><strong>Email:</strong> {quote.client_email or 'Non fourni'}</p>
            <p><strong>Téléphone:</strong> {quote.client_phone or 'Non fourni'}</p>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-top: 15px;">
                <strong>Services demandés:</strong><br>
                {services_list}
            </div>
            <div style="background: #38BDF8; color: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                <strong>Total:</strong> {quote.total_usd}$ / {quote.total_fc:,.0f} FC
            </div>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
                Reçu le {quote.created_at.strftime('%d/%m/%Y à %H:%M')}
            </p>
        </body>
    </html>
    """
    send_notification_email(admin_email, subject, content)

# ============== ROUTES ==============

@api_router.get("/")
async def root():
    return {"message": "Bienvenue sur l'API Neuronova"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "neuronova-api"}

# Services & Pricing
@api_router.get("/services-pricing")
async def get_services_pricing():
    """Get all services with pricing"""
    return {
        "categories": SERVICES_DATABASE,
        "packs": PACKS,
        "exchange_rate": {"usd_to_fc": 2200}
    }

@api_router.get("/packs")
async def get_packs():
    """Get all service packs"""
    return PACKS

# Quote endpoints
@api_router.post("/quotes", response_model=dict)
async def create_quote(input: QuoteRequestCreate, background_tasks: BackgroundTasks):
    """Create a new quote request"""
    quote = QuoteRequest(**input.model_dump())
    doc = quote.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.quotes.insert_one(doc)
    
    # Send email notification in background
    background_tasks.add_task(send_quote_notification, quote)
    
    return {
        "status": "success",
        "quote_id": quote.id,
        "message": "Votre devis a été enregistré. Notre équipe vous contactera sous 24h."
    }

@api_router.get("/quotes/{quote_id}")
async def get_quote(quote_id: str):
    """Get a specific quote by ID"""
    quote = await db.quotes.find_one({"id": quote_id}, {"_id": 0})
    if not quote:
        raise HTTPException(status_code=404, detail="Devis non trouvé")
    return quote

@api_router.get("/quotes/client/{email}")
async def get_client_quotes(email: str):
    """Get all quotes for a client by email"""
    quotes = await db.quotes.find({"client_email": email}, {"_id": 0}).to_list(50)
    return quotes

# Contact endpoints
@api_router.post("/contact", response_model=dict)
async def create_contact(input: ContactMessageCreate, background_tasks: BackgroundTasks):
    """Submit a contact message"""
    contact = ContactMessage(**input.model_dump())
    doc = contact.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.contacts.insert_one(doc)
    
    # Send email notification in background
    background_tasks.add_task(send_contact_notification, contact)
    
    return {
        "status": "success",
        "message": "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais."
    }

@api_router.get("/contacts", response_model=List[ContactMessage])
async def get_contacts():
    """Get all contact messages (admin)"""
    contacts = await db.contacts.find({}, {"_id": 0}).to_list(100)
    for contact in contacts:
        if isinstance(contact.get('created_at'), str):
            contact['created_at'] = datetime.fromisoformat(contact['created_at'])
    return contacts

# Testimonials endpoints
@api_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials():
    """Get all testimonials"""
    testimonials = await db.testimonials.find({}, {"_id": 0}).to_list(20)
    
    if not testimonials:
        return [
            {
                "id": "1",
                "name": "Marie Kabongo",
                "company": "TechStart RDC",
                "content": "Neuronova a transformé notre présence en ligne. Leur équipe est professionnelle et créative.",
                "rating": 5,
                "image_url": "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150"
            },
            {
                "id": "2",
                "name": "Patrick Mukendi",
                "company": "FinanceHub Africa",
                "content": "L'agent IA développé par Neuronova a révolutionné notre service client.",
                "rating": 5,
                "image_url": "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150"
            }
        ]
    return testimonials

# Services list (legacy)
@api_router.get("/services")
async def get_services():
    """Get list of services"""
    return [
        {"id": "web", "title": "Création de Sites Web", "description": "Sites vitrines, e-commerce, applications web.", "icon": "Globe"},
        {"id": "ai", "title": "Agents IA", "description": "Chatbots intelligents et automatisation.", "icon": "Bot"},
        {"id": "gadgets", "title": "Gadgets Tech", "description": "Conception et fabrication IoT.", "icon": "Cpu"},
        {"id": "security", "title": "Cybersécurité", "description": "Audits et protection des données.", "icon": "Shield"},
        {"id": "design", "title": "Design & Montage Vidéo", "description": "Identité visuelle et vidéos.", "icon": "Palette"},
        {"id": "coaching", "title": "Coaching Entrepreneurial", "description": "Accompagnement stratégique.", "icon": "Rocket"}
    ]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
