# SkillBridge – Connect, Share, and Grow Together

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-18.3.1-blue.svg)](https://react.dev/)
[![Prisma ORM](https://img.shields.io/badge/prisma-5.14.0-5A67D8.svg)](https://www.prisma.io/)
[![Database](https://img.shields.io/badge/postgresql-Neon-00E599.svg)](https://neon.tech/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

**SkillBridge** is a modern, responsive, production-oriented full-stack web application designed for reciprocal peer learning and skill exchange. The platform allows creators, developers, designers, students, and professionals to teach what they know and learn what they want without prohibitive tuition costs.

---

## 📌 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Technology Stack](#-technology-stack)
4. [Folder Structure](#-folder-structure)
5. [Database Architecture & Prisma Schema](#-database-architecture--prisma-schema)
6. [Smart Matching Algorithm](#-smart-matching-algorithm)
7. [Installation & Local Setup](#-installation--local-setup)
8. [Environment Variables](#-environment-variables)
9. [Sample Seed Accounts](#-sample-seed-accounts)
10. [REST API Documentation](#-rest-api-documentation)
11. [Testing Suite](#-testing-suite)
12. [Deployment Guide (Vercel, Render, Neon)](#-deployment-guide)
13. [Future Roadmap](#-future-roadmap)

---

## 🌟 Project Overview

Traditional online education suffers from passive video consumption and low completion rates. **SkillBridge** replaces isolated watching with active, 1-on-1 reciprocal exchanges:
- **User A** knows React and wants to learn UI/UX Design.
- **User B** knows UI/UX Design and wants to learn React.
- **SkillBridge** algorithmically identifies this mutual compatibility, facilitates a proposal, opens a private Socket.IO chat, schedules video sessions with conflict prevention, and collects verified peer reviews.

---

## 🚀 Key Features

### 1. Smart Matching Engine
- **Transparent Compatibility Scoring (20–100%):** Calculates match percentages based on skill complementarity (mutual vs. one-way), experience level, spoken language overlap, schedule availability, and user ratings.
- **Zero Hallucinated Metrics:** Match percentages are computed dynamically with full breakdown inspection available to the user.

### 2. End-to-End Skill Exchange Workflow
- Full state machine transition: `PENDING` ➔ `ACCEPTED` ➔ `SCHEDULED` ➔ `IN_PROGRESS` ➔ `COMPLETED` (or `REJECTED` / `CANCELLED`).
- Mutual visibility of active exchange statuses for both participants.

### 3. Real-Time Chat & Presences (Socket.IO)
- Instant 1-on-1 private messaging.
- Online/offline presence indicators.
- Live typing indicators ("User is typing...").
- Read receipts and unread message counter.

### 4. Interactive Learning Sessions & Calendar
- Schedule 1-on-1 video sessions with title, description, date/time, and duration.
- **Conflict Prevention Engine:** Prevents double bookings across host and attendee schedules.
- Automatic Jitsi Meet room generation for zero-install instant video calls.

### 5. Verified Reviews & Ratings
- Post-exchange rating system (1 to 5 stars) with written feedback.
- Strict constraint: Only verified completed exchanges are eligible for reviews.
- Duplicate review prevention and admin moderation.

### 6. Role-Based Portals & Dashboards
- **Student / Regular User:** Browse skills, manage teaching & learning wishlists, find matches, exchange skills.
- **Mentor:** Dedicated Mentor Hub to manage student proposals, view teaching stats, and set availability.
- **Administrator:** Comprehensive analytics panel (Recharts growth and category distributions), user activation/suspension, skill taxonomy management, and trust report resolution.

### 7. Complete Public Website (13 Pages)
- **Home**, **About Us**, **How It Works**, **Explore Skills**, **Find Mentors**, **Community Hub**, **Contact Us**, **Login**, **Register**, **Forgot Password**, **Reset Password**, **Terms of Service**, **Privacy Policy**, plus dynamic **User Profile** and **Skill Detail** pages.

---

## 🛠 Technology Stack

### Frontend
- **Framework:** React.js (v18.3) with Vite
- **Styling:** Bootstrap 5, Custom CSS (#2563EB primary, #6366F1 secondary, #F8FAFC background, #0F172A navy text)
- **Icons:** Lucide React
- **Routing:** React Router DOM (v6) with Protected, Mentor, and Admin route guards
- **State & Context:** React Context API (`AuthContext`, `SocketContext`, `ToastContext`)
- **HTTP Client:** Axios with request & response interceptors
- **Data Visualization:** Recharts for admin analytics
- **Real-Time Client:** Socket.IO Client

### Backend
- **Runtime:** Node.js (v18+) & Express.js
- **Database ORM:** Prisma ORM with PostgreSQL (Supports Neon Serverless DB)
- **Authentication:** JWT (JSON Web Tokens) with crypto/PBKDF2 fallback
- **Password Security:** Salted hashing with bcryptjs
- **Real-Time:** Socket.IO Server with authenticated room namespaces
- **File Uploads:** Multer with mime-type filtering (JPEG, PNG, WebP)
- **Security:** Helmet HTTP headers, CORS, express-rate-limit, request sanitization

---

## 📂 Folder Structure

```
skillbridge/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/        # StarRating, Modal, EmptyState, LoadingSkeleton
│   │   │   ├── layout/        # Navbar, Footer
│   │   │   ├── cards/         # UserCard, SkillCard, MatchCard, ExchangeCard, SessionCard
│   │   │   └── forms/         # ProposeExchangeModal, ScheduleSessionModal, ReviewModal
│   │   ├── pages/
│   │   │   ├── public/        # Home, ExploreSkills, FindMentors, HowItWorks, About, Community, Contact, Terms, Privacy
│   │   │   ├── auth/          # Login, Register, ForgotPassword, ResetPassword
│   │   │   ├── user/          # UserDashboard, Matches, Exchanges, Sessions, Chat, Reviews, Profile, Notifications
│   │   │   ├── mentor/        # MentorDashboard
│   │   │   └── admin/         # AdminDashboard
│   │   ├── layouts/           # UserLayout (Sidebar & Dashboard Shell)
│   │   ├── context/           # AuthContext, SocketContext, ToastContext
│   │   ├── services/          # Centralized Axios API client
│   │   ├── routes/            # ProtectedRoute, MentorRoute, AdminRoute
│   │   ├── styles/            # theme.css
│   │   ├── App.jsx            # React Router Routes
│   │   └── main.jsx           # Client entry
│   ├── index.html
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Normalized PostgreSQL schema
│   │   ├── seedData.js        # 15 users, 5 mentors, 20 skills, 8 categories, exchanges
│   │   └── seed.js            # Prisma seeder
│   ├── src/
│   │   ├── config/            # db.js (Dual PostgreSQL Prisma & in-memory engine)
│   │   ├── controllers/       # auth, user, skill, matching, exchange, session, message, review, admin
│   │   ├── middleware/        # auth, upload, errorHandler
│   │   ├── routes/            # auth, user, skill, matching, exchange, session, message, review, admin
│   │   ├── services/          # matchingService.js
│   │   ├── sockets/           # socketHandler.js (presence, typing, rooms)
│   │   ├── validators/        # validators.js
│   │   ├── utils/             # jwt, password, response, expressShim
│   │   ├── app.js             # Express app
│   │   └── server.js          # HTTP & Socket.IO server
│   ├── uploads/               # User uploaded avatars
│   ├── tests/                 # Automated test runner
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🗄 Database Architecture & Prisma Schema

The application features a normalized schema with 16 Prisma models:
- **User:** Authentication credentials, role (`USER`, `MENTOR`, `ADMIN`), activation status (`isActive`), verification status.
- **Profile:** Bio, location, education, occupation, languages, availability, ratings, completed exchanges, mentor bio.
- **SkillCategory:** Categories (`Web Development`, `Mobile Development`, `UI/UX Design`, `Data Science & AI`, etc.).
- **Skill:** Name, slug, difficulty (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`), category relation.
- **UserOfferedSkill:** Skills a user teaches, proficiency level, years experience, description.
- **UserWantedSkill:** Skills a user seeks, priority, learning goals.
- **ExchangeRequest:** Sender, receiver, offered skill, wanted skill, message, schedule, status, match score.
- **ExchangeSession:** Scheduled video sessions, host, attendee, start/end time, duration, meeting link, status.
- **Conversation & ConversationParticipant:** 1-on-1 private messaging channel.
- **Message:** Real-time messages with read status.
- **Review:** Verified ratings (1–5) and feedback tied to completed exchanges.
- **Notification:** Real-time user alerts for requests, messages, sessions, and reviews.
- **Report:** Community safety reports and moderation resolutions.
- **PasswordResetToken & EmailVerificationToken:** Secure tokens with expiry.

---

## ⚡ Smart Matching Algorithm

The matching algorithm (`backend/src/services/matchingService.js`) calculates a score out of 100:
1. **Skill Complementarity (Max 50 pts):**
   - **Direct Mutual Match:** User A teaches what User B wants **AND** User B teaches what User A wants (+50 pts).
   - **One-Way Teaching/Learning:** Candidate teaches what User seeks (+30 pts) or learns what User teaches (+25 pts).
   - **Category Overlap:** Shared interest in related disciplines (+15 pts).
2. **Proficiency & Experience (Max 15 pts):** Advanced and Expert mentors receive bonus weight.
3. **Language Compatibility (Max 15 pts):** Overlapping spoken languages for effective communication.
4. **Availability Overlap (Max 10 pts):** Matching weekday vs. weekend time slots.
5. **Rating & Reputation (Max 10 pts):** High ratings (≥ 4.5) grant top tier priority.

---

## 💻 Installation & Local Setup

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- PostgreSQL database (Optional locally — an automated in-memory store runs out-of-the-box if PostgreSQL is not active)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/skillbridge.git
cd skillbridge
```

### 2. Set Up the Backend
```bash
cd backend
npm install

# Copy environment variables
cp .env.example .env

# Generate Prisma Client (if using PostgreSQL)
npm run prisma:generate

# Run Database Migrations (if using PostgreSQL)
npm run prisma:migrate

# Seed Database with sample data
npm run db:seed

# Run Automated Test Suite
npm test

# Start the Backend Server
npm run dev
# Server will run on http://localhost:5000
```

### 3. Set Up the Frontend
```bash
cd ../frontend
npm install

# Copy environment variables
cp .env.example .env

# Start Vite Development Server
npm run dev
# Frontend will run on http://localhost:5173
```

---

## 🔑 Sample Seed Accounts

The database comes pre-seeded with 15 users, 5 mentors, 20 skills, 8 categories, and sample exchanges. You can instantly test all user roles:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@skillbridge.io` | `AdminSecurePassword2026!` | Access to Admin Panel, Analytics, Moderation, User suspension |
| **Mentor (React)** | `alex.morgan@example.com` | `Password123!` | Staff Frontend Engineer; teaches React, wants Figma UI/UX |
| **Mentor (UI/UX)** | `elena.design@example.com` | `Password123!` | Principal Product Designer; teaches Figma, wants React |
| **Mentor (AI/Data)** | `marcus.vance@example.com` | `Password123!` | AI Scientist; teaches Python/ML, wants Spanish |
| **Mentor (SEO/Spanish)** | `sofia.mendez@example.com` | `Password123!` | Head of Growth; teaches Spanish & SEO, wants Python Data |
| **Student (Node.js)** | `liam.oc@example.com` | `Password123!` | Backend Engineer; teaches Node.js, wants Japanese |
| **Student (Japanese)** | `kenji.sato@example.com` | `Password123!` | Native Japanese speaker; wants Node.js APIs |

> **Note:** On the login page, you can also click the **Demo Fast Login** chips to pre-fill credentials with a single click!

---

## 📡 REST API Documentation

### Authentication
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Sign in and obtain JWT
- `POST /api/auth/logout` — Invalidate session
- `GET /api/auth/me` — Get authenticated user details & profile
- `POST /api/auth/forgot-password` — Generate password reset token
- `POST /api/auth/reset-password` — Reset password using token
- `PUT /api/auth/update-password` — Change password for authenticated user

### Users & Profiles
- `GET /api/users` — Browse and filter users (search, category, experience, rating, sort)
- `GET /api/users/:id` — Get detailed user profile and reviews
- `PUT /api/users/profile` — Update biography, location, availability, languages
- `POST /api/users/avatar` — Upload avatar image (Multer)
- `DELETE /api/users/account` — Delete account

### Skills & Categories
- `GET /api/skills/categories` — Get all skill categories
- `GET /api/skills` — Get all skills with filtering
- `GET /api/skills/detail/:slug` — Get skill details and users offering it
- `GET /api/skills/user/my-skills` — Get current user's offered & wanted skills
- `POST /api/skills/user/offered` — Add a skill to teaching inventory
- `DELETE /api/skills/user/offered/:skillId` — Remove an offered skill
- `POST /api/skills/user/wanted` — Add a skill to learning wishlist
- `DELETE /api/skills/user/wanted/:skillId` — Remove a wanted skill

### Smart Matching
- `GET /api/matches` — Get compatibility matches for current user
- `GET /api/matches/:targetUserId` — Calculate direct compatibility score with specific user

### Skill Exchanges
- `GET /api/exchanges` — List user's exchanges (filtered by status or type)
- `GET /api/exchanges/:id` — Get exchange details
- `POST /api/exchanges` — Send skill exchange proposal
- `PUT /api/exchanges/:id/accept` — Accept proposal (creates chat conversation)
- `PUT /api/exchanges/:id/reject` — Decline proposal
- `PUT /api/exchanges/:id/complete` — Mark exchange completed
- `PUT /api/exchanges/:id/cancel` — Cancel exchange

### Sessions
- `GET /api/sessions` — List upcoming and completed sessions
- `POST /api/sessions` — Schedule session (with schedule conflict check)
- `PUT /api/sessions/:id` — Update/reschedule session
- `DELETE /api/sessions/:id` — Cancel session

### Messages & Real-Time Chat
- `GET /api/messages/conversations` — Get user conversation list
- `POST /api/messages/conversations/direct` — Start direct conversation
- `GET /api/messages/conversations/:id/messages` — Get message history
- `POST /api/messages/conversations/:id/messages` — Post message

### Reviews
- `POST /api/reviews` — Submit verified review on completed exchange
- `GET /api/reviews/user/:userId` — Get reviews received by a user

### Admin Panel
- `GET /api/admin/dashboard` — Platform analytics, KPIs, and growth metrics
- `GET /api/admin/users` — Admin user management with search & role filter
- `PUT /api/admin/users/:id/status` — Suspend or activate user accounts
- `GET /api/admin/reports` — Platform safety reports queue
- `PUT /api/admin/reports/:id/status` — Resolve or dismiss reports

---

## 🧪 Testing Suite

The repository contains an automated test runner testing critical algorithms, permissions, and security.

Run backend tests:
```bash
cd backend
npm test
```

### Verified Test Cases:
1. `Password Hashing & PBKDF2 / Bcrypt Verification`
2. `JWT Token Generation, Extraction, and Expiry`
3. `Smart Matching Algorithm - Strong Mutual Match (>90%)`
4. `Smart Matching Algorithm - Low Complementarity (<60%)`
5. `Database Models & Initial Seed Data Verification`
6. `Exchange Request State Machine (Pending -> Accepted -> Completed)`
7. `Review Eligibility & Duplicate Submission Prevention`
8. `Calendar Conflict Prevention & Booking Validation`

---

## 🚀 Deployment Guide

### 1. Database: Neon Serverless PostgreSQL
1. Sign up at [Neon.tech](https://neon.tech) and create a new project.
2. Copy the pooled connection string `DATABASE_URL`:
   ```env
   DATABASE_URL="postgresql://user:password@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```
3. Run migrations and seed data:
   ```bash
   npx prisma migrate deploy
   node prisma/seed.js
   ```

### 2. Backend: Render
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your repository and set the Root Directory to `backend`.
3. Build Command: `npm install && npx prisma generate`
4. Start Command: `node src/server.js`
5. Environment Variables:
   - `DATABASE_URL`: Your Neon connection string
   - `JWT_SECRET`: A secure 64-character random string
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: Your Vercel frontend URL (e.g. `https://skillbridge.vercel.app`)

### 3. Frontend: Vercel
1. Import the repository on [Vercel](https://vercel.com).
2. Set Root Directory to `frontend`.
3. Framework Preset: `Vite`.
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Environment Variables:
   - `VITE_API_URL`: Your Render backend API URL (e.g. `https://skillbridge-api.onrender.com/api`)
   - `VITE_SOCKET_URL`: Your Render backend URL (e.g. `https://skillbridge-api.onrender.com`)

---

## 🔮 Future Roadmap
- [ ] Integration with Google Calendar and Outlook via OAuth2
- [ ] Automated skill badge verification via interactive mini-quizzes
- [ ] Group learning workshops & community study circles
- [ ] Native mobile apps using React Native

---

## 📄 License
This project is licensed under the MIT License. Built with passion for open peer learning.
