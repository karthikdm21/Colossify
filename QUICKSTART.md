# Quick Start Guide - Colossify

## Complete Setup (5 minutes)

### 1. Start Backend Services

```bash
# Navigate to project root
cd d:/fail

# Create .env file for Docker
echo "OPENAI_API_KEY=sk-your-key-here" > .env
echo "JWT_SECRET=your-secret-key" >> .env

# Start all services (PostgreSQL, n8n, API)
docker-compose up -d

# Wait for services to start (30 seconds)
timeout /t 30

# Setup database
cd backend
npm install
npx prisma migrate dev --name init
```

### 2. Import n8n Workflow

1. Open http://localhost:5678
2. Login: `admin` / `admin123`
3. Click "Import from File"
4. Select `backend/n8n-workflows/realtime-sync.json`
5. Click "Activate" workflow

### 3. Start Frontend

```bash
# In new terminal
cd d:/fail
npm run dev
```

### 4. Test Real-Time Sync

**As Founder:**
1. Go to http://localhost:3000
2. Select "I'm a Founder"
3. Submit a new idea
4. OpenAI validates it (server-side)
5. n8n webhook triggers

**As Investor:**
1. Open incognito window
2. Go to http://localhost:3000
3. Select "I'm an Investor"
4. Request access to founder's idea
5. n8n webhook triggers → Founder gets notification in real-time

**Back to Founder:**
6. See notification bell update (real-time!)
7. Approve access request
8. n8n webhook triggers → Investor gets notification

**Back to Investor:**
9. See notification (real-time!)
10. Make investment proposal
11. n8n webhook triggers → Founder gets notification

**The cycle continues!** All changes sync in real-time via n8n.

## Architecture

```
Frontend (Next.js) ←→ Backend API (Express) ←→ PostgreSQL
                           ↓
                      OpenAI API (server-side only!)
                           ↓
                      n8n Webhooks
                           ↓
                  Real-Time Notifications
```

## Key Features

✅ **OpenAI Integration** - Server-side only, API key never exposed
✅ **Real-Time Sync** - n8n webhooks sync changes between users
✅ **Role-Based Auth** - Founder vs Investor experiences
✅ **Complete Workflow** - Access requests → Proposals → Negotiation
✅ **Production Ready** - Docker Compose, migrations, security

## API Endpoints

- POST `/api/auth/register` - Create account
- POST `/api/auth/login` - Get JWT token
- POST `/api/ideas/validate` - Submit idea (calls OpenAI)
- POST `/api/access-requests` - Request access (triggers n8n)
- POST `/api/access-requests/:id/respond` - Approve/reject (triggers n8n)
- POST `/api/proposals` - Make proposal (triggers n8n)
- POST `/api/proposals/:id/counter` - Counter-propose (triggers n8n)

## Troubleshooting

**Backend not starting:**
```bash
docker-compose logs api
```

**n8n not receiving webhooks:**
- Check n8n is running: http://localhost:5678
- Verify workflow is activated
- Check webhook URL in backend/.env

**OpenAI errors:**
- Verify API key in .env
- Check account has credits
- Backend falls back to mock responses if API fails

## Next Steps

1. Add your OpenAI API key to `.env`
2. Customize the n8n workflow for your needs
3. Add email notifications
4. Deploy to production
