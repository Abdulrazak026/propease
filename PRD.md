# Product Requirements Document: PropEase (Mai Binciken Property Pro)

## Product Overview
PropEase is a digital real estate marketplace connecting property seekers with verified listings in Kano, Nigeria. The platform enables property transactions including rent, sale, and outsourcing across Kano Municipal, Fagge, Tarauni, and Nassarawa. It features a multi-role dashboard system for admins, agents, and ambassadors.

## Target Users
- **Property Seekers**: Browse, search, and inquire about properties
- **Agents**: Manage listings, commissions, and client inquiries
- **Ambassadors**: Post listings, create tasks, manage commissions
- **Admins**: Oversee users, CRM, outsourcing, agent tracking, deals

## Core Features

### 1. Property Listings
- Browse properties with filters (location, price, type, purpose)
- View property details with photos, description, and agent info
- "Show More" infinite-scroll pagination
- Rent tier breakdown for rental properties

### 2. User Authentication & Roles
- Role-based access: Admin, Agent, Ambassador, User
- Login/Register with email and password
- Wallet system for financial transactions
- Saved/favorited properties using localStorage

### 3. Dashboards
- **Admin Dashboard**: Users, CRM, outsourcing, agent tracking, commissions, deals, settings, audit log
- **Agent Dashboard**: Task board, inquiries, commissions, wallet, settings
- **Ambassador Dashboard**: City overview, post listing, create task, commissions, wallet, settings

### 4. Additional Features
- Custom property order requests
- Agent profiles and search
- Contact form
- Privacy policy and terms of service pages
- Onboarding modal for new users

## Technical Architecture

### Frontend (Next.js 16 + React 19)
- App Router with 18 route groups
- Tailwind CSS v4 for styling
- RoleContext for auth state management (localStorage-based mock auth)
- Mock data for all entities (listings, users, tasks, commissions, etc.)

### Backend (Express.js + PostgreSQL)
- RESTful API on port 4000
- JWT authentication with refresh tokens
- Prisma ORM with 16 database models
- Zod input validation
- Role-based access control middleware
- File upload support via multer + Cloudflare R2

## User Flows

### Property Search & Viewing
1. User visits homepage
2. Views featured properties with filters
3. Applies filters (location, price range, property type)
4. Clicks "Show More" for additional listings
5. Clicks a property card to view details
6. Views full property information and agent contact

### Authentication
1. New user registers with name, email, password
2. User logs in with credentials
3. User session managed via localStorage + RoleContext
4. User can log out

### Agent Dashboard
1. Agent logs in
2. Views task board with assignments
3. Manages incoming inquiries
4. Views commission history and earnings
5. Updates profile/settings

### Admin Operations
1. Admin logs in
2. Manages users (view, edit, delete)
3. Oversees CRM operations
4. Tracks outsourcing requests
5. Monitors agent performance
6. Manages commission rates and deals

## Non-Functional Requirements
- Responsive design for mobile and desktop
- Fast page loads via Next.js SSR/SSG
- TypeScript throughout for type safety
- Accessible UI components
- Error handling and validation on forms
