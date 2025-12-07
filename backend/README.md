# Colossify - Backend

## Overview

Minimal production-ready backend with OpenAI integration, PostgreSQL, and n8n for real-time sync between founders and investors.

## Tech Stack

- **Framework**: Express + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **AI**: OpenAI API (server-side only)
- **Automation**: n8n for webhooks and real-time sync
- **Auth**: JWT tokens with bcrypt
- **Security**: Helmet, CORS, rate limiting

## Setup Instructions

### 1. Prerequisites

- Node.js 18+
- Docker & Docker Compose
- OpenAI API Key

### 2. Environment Setup

Create `backend/.env` file:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/startup_incubation?schema=public"
OPENAI_API_KEY="sk-your-openai-api-key-here"
JWT_SECRET="your-super-secret-jwt-key"
N8N_WEBHOOK_URL="http://localhost:5678/webhook/sync"
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

### 3. Start Services with Docker

```bash
# Start all services (PostgreSQL, n8n, API)
docker-compose up -d

# Check logs
docker-compose logs -f api
```

### 4. Database Setup

```bash
cd backend

# Install dependencies
npm install

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npm run db:seed
```

### 5. Access Services

- **Backend API**: http://localhost:3001
- **n8n Workflow**: http://localhost:5678 (admin/admin123)
- **PostgreSQL**: localhost:5432

## API Endpoints

### Authentication

**POST /api/auth/register**
```json
{
  "email": "founder@example.com",
  "name": "John Doe",
  "password": "password123",
  "role": "FOUNDER"
}
```

**POST /api/auth/login**
```json
{
  "email": "founder@example.com",
  "password": "password123"
}
```

### Ideas

**POST /api/ideas/validate** (Founder only)
- Validates idea using OpenAI API (server-side)
- Creates embeddings for similarity search
- Triggers `NEW_IDEA_VALIDATED` webhook

**GET /api/ideas** - List all ideas (filtered by role)

**GET /api/ideas/:id** - Get idea with visibility control

**POST /api/ideas/:id/publish** - Publish to showcase

### Access Requests

**POST /api/access-requests** (Investor only)
- Creates access request
- Triggers `ACCESS_REQUEST_CREATED` webhook
- Notifies founder in real-time via n8n

**POST /api/access-requests/:id/respond** (Founder only)
- Approve/reject/request more info
- Triggers `ACCESS_REQUEST_RESPONDED` webhook
- Notifies investor in real-time

**GET /api/access-requests** - List requests (filtered by role)

### Proposals

**POST /api/proposals** (Investor only, requires access)
- Creates investment proposal
- Triggers `NEW_PROPOSAL` webhook
- Notifies founder in real-time

**POST /api/proposals/:id/counter** (Founder only)
- Send counter-proposal
- Triggers `PROPOSAL_COUNTERED` webhook
- Notifies investor in real-time

**GET /api/proposals** - List proposals (filtered by role)

### Notifications

**GET /api/notifications** - Get user notifications

**POST /api/notifications/:id/read** - Mark as read

### Dashboard

**GET /api/dashboard/:role** - Get role-specific metrics

## OpenAI Integration

### Security Best Practices

✅ **API Key stored server-side only** in `process.env.OPENAI_API_KEY`
✅ **Never exposed to frontend**
✅ **All OpenAI calls in `/src/services/openai.ts`**
✅ **Fallback responses if API fails**

### Usage

```typescript
// Server-side only!
import { validateIdea } from './services/openai';

const result = await validateIdea({
  title: "AI Learning Platform",
  description: "...",
  // ... other fields
});

// Returns: { score, summary, originalityScore, embedding }
```

## n8n Workflow Setup

### 1. Import Workflow

1. Open n8n at http://localhost:5678
2. Login with `admin` / `admin123`
3. Click "Import from File"
4. Select `backend/n8n-workflows/realtime-sync.json`
5. Activate the workflow

### 2. Webhook Events

The workflow listens for these events:

- **NEW_IDEA_VALIDATED** - Idea submitted and validated
- **ACCESS_REQUEST_CREATED** - Investor requests access
- **ACCESS_REQUEST_RESPONDED** - Founder approves/rejects
- **NEW_PROPOSAL** - Investor sends proposal
- **PROPOSAL_COUNTERED** - Founder sends counter-proposal

### 3. Real-Time Sync Flow

```
Backend API → n8n Webhook → Process Event → Broadcast to Frontend
```

**Example Flow:**
1. Investor requests access (POST /api/access-requests)
2. Backend triggers n8n webhook with `ACCESS_REQUEST_CREATED`
3. n8n processes event and notifies founder
4. Founder sees notification in real-time
5. Founder approves (POST /api/access-requests/:id/respond)
6. Backend triggers `ACCESS_REQUEST_RESPONDED`
7. n8n notifies investor
8. Investor sees approval in real-time

## Database Schema

### Users
- id, email, name, password (hashed), role (FOUNDER/INVESTOR)

### Ideas
- id, title, category, description, problemStatement, solution, targetMarket, businessModel
- requestedFunding, equityOffered, traction
- aiScore, aiSummary, originalityScore, embedding (OpenAI)
- founderId, published

### AccessRequests
- id, message, ndaRequired, status (PENDING/APPROVED/REJECTED/MORE_INFO)
- ideaId, investorId

### Proposals
- id, fundingAmount, equityOffer, milestones (JSON), termSheetNotes
- status (PENDING/ACCEPTED/COUNTERED/REJECTED)
- ideaId, investorId, founderId

### Notifications
- id, type, title, message, read, relatedId, userId

### AuditLogs
- id, action, actor, details, ideaId, userId

## Development

```bash
# Run in development mode
cd backend
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Testing

```bash
# Test OpenAI integration
curl -X POST http://localhost:3001/api/ideas/validate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AI Learning Platform",
    "category": "EdTech",
    "description": "Personalized learning using AI",
    "problemStatement": "Students learn at different paces",
    "solution": "Adaptive AI tutoring",
    "targetMarket": "K-12 students",
    "businessModel": "Subscription",
    "requestedFunding": 500000,
    "equityOffered": 10
  }'
```

## Security Checklist

✅ OpenAI API key stored in environment variables only
✅ JWT authentication on all protected routes
✅ Password hashing with bcrypt
✅ Rate limiting on API endpoints
✅ Helmet for security headers
✅ CORS configured for frontend origin
✅ Input validation with Zod
✅ SQL injection protection via Prisma
✅ Audit logging for all actions

## Production Deployment

1. Set strong `JWT_SECRET`
2. Use managed PostgreSQL (AWS RDS, Supabase, etc.)
3. Deploy n8n to cloud (n8n.cloud or self-hosted)
4. Set `NODE_ENV=production`
5. Enable HTTPS
6. Rotate OpenAI API keys regularly
7. Monitor API usage and costs
8. Set up error tracking (Sentry, etc.)

## Troubleshooting

**OpenAI API errors:**
- Check API key is valid
- Verify account has credits
- Check rate limits
- Review fallback responses

**n8n webhook not triggering:**
- Verify n8n is running
- Check webhook URL in .env
- Review n8n workflow is activated
- Check n8n logs

**Database connection issues:**
- Verify PostgreSQL is running
- Check DATABASE_URL is correct
- Run migrations: `npx prisma migrate dev`

## Next Steps

- [ ] Add WebSocket support for real-time updates
- [ ] Implement file upload for pitch decks
- [ ] Add email notifications via n8n
- [ ] Create admin dashboard
- [ ] Add analytics and reporting
- [ ] Implement vector similarity search with pgvector
- [ ] Add PDF generation for proposals
- [ ] Set up CI/CD pipeline
