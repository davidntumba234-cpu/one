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
    name: str
    email: EmailStr
    service: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class QuoteRequestCreate(BaseModel):
    name: str
    email: EmailStr
    service: str
    message: str

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
    subject = f"Nouvelle demande de devis - {quote.service}"
    content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #F59E0B;">Nouvelle Demande de Devis</h2>
            <p><strong>Service:</strong> {quote.service}</p>
            <p><strong>Nom:</strong> {quote.name}</p>
            <p><strong>Email:</strong> {quote.email}</p>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-top: 15px;">
                <strong>Description du projet:</strong>
                <p>{quote.message}</p>
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

# Quote request endpoints
@api_router.post("/quote", response_model=dict)
async def create_quote(input: QuoteRequestCreate, background_tasks: BackgroundTasks):
    """Submit a quote request"""
    quote = QuoteRequest(**input.model_dump())
    doc = quote.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.quotes.insert_one(doc)
    
    # Send email notification in background
    background_tasks.add_task(send_quote_notification, quote)
    
    return {
        "status": "success",
        "message": "Votre demande de devis a été envoyée. Notre équipe vous contactera sous 24h."
    }

@api_router.get("/quotes", response_model=List[QuoteRequest])
async def get_quotes():
    """Get all quote requests (admin)"""
    quotes = await db.quotes.find({}, {"_id": 0}).to_list(100)
    for quote in quotes:
        if isinstance(quote.get('created_at'), str):
            quote['created_at'] = datetime.fromisoformat(quote['created_at'])
    return quotes

# Testimonials endpoints
@api_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials():
    """Get all testimonials"""
    testimonials = await db.testimonials.find({}, {"_id": 0}).to_list(20)
    
    # If no testimonials exist, return default ones
    if not testimonials:
        return [
            {
                "id": "1",
                "name": "Marie Kabongo",
                "company": "TechStart RDC",
                "content": "Neuronova a transformé notre présence en ligne. Leur équipe est professionnelle et créative. Notre site attire maintenant 3x plus de clients.",
                "rating": 5,
                "image_url": "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150"
            },
            {
                "id": "2",
                "name": "Patrick Mukendi",
                "company": "FinanceHub Africa",
                "content": "L'agent IA développé par Neuronova a révolutionné notre service client. Réponses instantanées 24/7, nos clients sont ravis!",
                "rating": 5,
                "image_url": "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150"
            },
            {
                "id": "3",
                "name": "Sophie Ilunga",
                "company": "EcoVert Kinshasa",
                "content": "Excellente collaboration sur notre identité visuelle. Le design est moderne et reflète parfaitement nos valeurs environnementales.",
                "rating": 5,
                "image_url": "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150"
            },
            {
                "id": "4",
                "name": "Jean-Baptiste Lumumba",
                "company": "SecureBank Congo",
                "content": "L'audit cybersécurité de Neuronova a identifié des failles critiques. Leur expertise nous a permis de renforcer significativement notre infrastructure.",
                "rating": 5,
                "image_url": "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150"
            }
        ]
    return testimonials

# Services list
@api_router.get("/services")
async def get_services():
    """Get list of services"""
    return [
        {
            "id": "web",
            "title": "Création de Sites Web",
            "description": "Sites vitrines, e-commerce, applications web sur mesure avec les dernières technologies.",
            "icon": "Globe"
        },
        {
            "id": "ai",
            "title": "Agents IA",
            "description": "Chatbots intelligents, assistants virtuels et automatisation par intelligence artificielle.",
            "icon": "Bot"
        },
        {
            "id": "gadgets",
            "title": "Gadgets Tech",
            "description": "Conception et fabrication de dispositifs IoT et solutions hardware innovantes.",
            "icon": "Cpu"
        },
        {
            "id": "security",
            "title": "Cybersécurité",
            "description": "Audits de sécurité, protection des données et formation aux bonnes pratiques.",
            "icon": "Shield"
        },
        {
            "id": "design",
            "title": "Design & Montage Vidéo",
            "description": "Identité visuelle, UI/UX design, montage vidéo professionnel et motion design.",
            "icon": "Palette"
        },
        {
            "id": "coaching",
            "title": "Coaching Entrepreneurial",
            "description": "Accompagnement stratégique, mentorat et formation pour entrepreneurs tech.",
            "icon": "Rocket"
        }
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
