# Colossify – Startup Incubation Platform

Colossify is a full-stack platform that connects founders with startup ideas to investors looking for high-potential opportunities. It includes AI-powered idea validation, secure access control, and a complete founder–investor negotiation workflow.

**Live Demo:** [https://colossify21.netlify.app/](https://colossify21.netlify.app/)

---

## About the Project

Many creators hesitate to share their ideas due to fear of theft, lack of investor access, and absence of a proper validation system. Investors, on the other hand, struggle to filter genuine high-quality ideas.

Colossify solves this by providing secure idea submission, AI originality scoring, investor matching, proposal workflows, and a public success showcase.

The user interface follows a clean, modern, and minimal design inspired by the visual styling and layout principles used on the official OpenAI website.

---

## Core Features

### AI-Powered Idea Validation
- Generates originality score and AI summary
- Creates embeddings for similarity search
- Evaluates idea quality instantly

### Secure Access Control
- Role-based authentication (founder/investor)
- Founders approve which investors can view full details
- Password hashing and protected routes

### Investment Workflow
- Investors send proposals
- Founders can accept, reject, or negotiate
- Status tracking for all proposal stages

### Real-Time Updates
- n8n automation for request notifications
- Instant UI updates

### Modern Frontend UI
- Minimal, dark-themed interface inspired by OpenAI's design language
- Fully responsive on all devices
- Smooth animations and transitions

---

## Tech Stack

### Frontend
- Next.js 15
- React
- Tailwind CSS
- Zustand
- Framer Motion

### Backend
- Node.js
- Express
- PostgreSQL
- Prisma

### AI & Automation
- OpenAI API for validation and embeddings
- n8n for real-time automation

### Security
- JWT authentication
- Bcrypt password hashing
- Zod request validation

---

## Project Structure

```
/app                 → Next.js app router pages
/components          → Reusable UI components
/lib                 → Stores, utilities, mock APIs
/backend
   /src/routes       → API routes
   /src/services     → AI, DB, business logic
   /middleware       → Authentication
/prisma              → Database schema
```

---

## Getting Started

### 1. Clone the Project
```bash
git clone https://github.com/karthikdm21/colossify-startup.git
cd colossify-startup
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

```env
DATABASE_URL=your_postgres_url
OPENAI_API_KEY=your_openai_key
JWT_SECRET=your_secret_key
```

---

## Deployment

**Frontend:** Deployed on Netlify  
🔗 [https://colossify21.netlify.app/](https://colossify21.netlify.app/)

**Backend:** Can be deployed using:
- Railway
- Render
- Vercel (API routes)
- AWS or GCP

---

## Screenshots

Add images inside a `screenshots` folder:
```
/screenshots/home.png
/screenshots/dashboard.png
/screenshots/ai-validation.png
```

---

## Contributing

Pull requests and issue submissions are welcome. Contributions help improve the platform.

---

## License

This project is licensed under the MIT License.

---

## Final Note

Colossify is built to transform how innovation starts — protecting ideas, connecting founders and investors, and celebrating successful innovations. The UI design is intentionally inspired by the clean and modern visual style of the OpenAI website.
