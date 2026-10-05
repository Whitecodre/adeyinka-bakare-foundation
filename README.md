# Adeyinka Bakare Fellowship (ABF)

<div align="center">
  <img src="public/brand/logo.png" alt="ABF Logo" width="120" height="120" />
  
  **Empowering IT Students For Academic Excellence**
  
  [![Next.js](https://img.shields.io/badge/Next.js-16.3.8-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-3.0-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
</div>

## 📋 Overview

The Adeyinka Bakare Fellowship (ABF) is a comprehensive web platform designed to support intentional undergraduate students in the Department of Information Technology at the University of Ilorin. The fellowship provides need-based and merit-based scholarships, mentorship programs, career development opportunities, and a supportive academic community.

This is a production-ready Next.js 16 application built with:
- **Supabase** for PostgreSQL database, authentication, and storage
- **Row-Level Security (RLS)** for data protection
- **Multi-factor authentication** (MFA, TOTP, passkeys, recovery codes)
- **Layered architecture** with clean separation of concerns
- **Premium UI** with glass morphism effects and smooth animations
- **Admin dashboard** for comprehensive content management

## 🚀 Features

### Public Website
- **Premium Homepage** with animated hero section and brand colors
- **Stacked Card Scroll Effect** for "What We Offer" section
- **Responsive Navigation** with Zyng-style scroll animations
- **Programme Showcase** organized by academic level (100L-400L)
- **Mission & Vision** with interactive pillar cards
- **Impact Statistics** (20+ scholarships, 100+ members, 5+ placements)
- **Student Imagery** from Unsplash with proper licensing
- **Mobile-First Design** with responsive layouts

### Admin Dashboard
- **Dashboard Overview** with key metrics and statistics
- **Member Management** with CRUD operations
- **Beneficiary Management** for scholarship recipients
- **Programme Management** for academic initiatives
- **Event Management** with scheduling and details
- **News & Updates** management
- **Testimonials** curation
- **Volunteer Management**
- **Media Library** with Supabase Storage integration
- **Content Management** for site-wide content
- **Footer & Social Links** configuration
- **Notification System** for admin alerts
- **Security Settings** for authentication configuration

### Authentication & Security
- **Email/Password Authentication** via Supabase Auth
- **Multi-Factor Authentication (MFA)** with TOTP
- **Passkey Support** (WebAuthn) for passwordless login
- **Recovery Codes** for account recovery
- **Role-Based Access Control** (Admin, Member, Volunteer)
- **Session Management** with secure tokens
- **Encrypted Secrets** storage

### Technical Architecture
- **Layered Architecture**: Routes → Auth → Validation → Services → Repositories → Database
- **API Routes**: Thin handlers for authentication, validation, and service calls
- **Service Layer**: Business logic with slug generation and actor tracking
- **Repository Layer**: Direct Supabase query operations
- **Validation Layer**: Zod schemas for all entities
- **Storage Layer**: File upload, delete, and signed URL generation
- **Security Layer**: Encryption, TOTP, passkeys, recovery codes

## 🎨 Design System

### Brand Colors
- **Maroon**: `#aa322b` (primary), `#922821` (dark), `#73201c` (darker)
- **Gold**: `#f8c84d` (light), `#efb11f` (primary), `#d9960d` (dark)
- **Cream**: `#fffdf8` (background)
- **Sand**: `#f8f2e8` (secondary background)
- **Ink**: `#2d1816` (text)

### UI Components
- **shadcn/ui** with glass morphism effects
- **Framer Motion** for smooth animations
- **Lucide React** for consistent iconography
- **Tailwind CSS v4** for utility-first styling

### Animation Effects
- **Scroll-triggered animations** for feature cards
- **Staggered entry animations** for lists
- **Hover effects** with smooth transitions
- **GPU-accelerated transforms** for performance

## 📁 Project Structure

```
adeyinka-bakare-foundation/
├── components/
│   ├── admin/              # Admin dashboard components
│   ├── homepage/           # Homepage-specific components
│   ├── public/             # Public-facing components
│   └── ui/                 # shadcn/ui base components
├── config/                 # Configuration files
│   ├── admin-navigation.ts
│   ├── brand.ts
│   ├── navigation.ts
│   └── site.ts
├── hooks/                  # Custom React hooks
├── lib/
│   ├── auth/               # Authentication utilities
│   ├── constants/          # Application constants
│   ├── notifications/      # Notification system
│   ├── repositories/       # Database repositories
│   ├── security/           # Security utilities
│   ├── services/           # Business logic services
│   ├── storage/            # Supabase storage utilities
│   ├── supabase/           # Supabase client configurations
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── validations/        # Zod validation schemas
├── public/
│   └── brand/              # Brand assets (logos, favicons)
├── src/
│   ├── app/
│   │   ├── (public)/       # Public pages
│   │   ├── admin/          # Admin dashboard pages
│   │   ├── auth/           # Authentication pages
│   │   ├── api/            # API routes
│   │   ├── layout.tsx      # Root layout
│   │   └── globals.css     # Global styles
│   └── ...
├── supabase/
│   └── migrations/         # Database migrations
├── docs/
│   └── ABF_Details.md      # ABF constitution and details
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.3.8** - React framework with App Router
- **React 19.2.8** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS v4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication (Auth)
  - Storage (S3-compatible)
  - Row-Level Security (RLS)
- **@supabase/ssr** - Server-side rendering support
- **@supabase/supabase-js** - Supabase client

### Validation & Security
- **Zod** - Schema validation
- **bcryptjs** - Password hashing
- **jose** - JWT handling
- **otplib** - TOTP generation
- **qrcode** - QR code generation
- **@simplewebauthn/server** - Passkey authentication
- **slugify** - URL slug generation
- **date-fns** - Date manipulation

### UI Components
- **shadcn/ui** - Reusable component library
- **Radix UI** - Unstyled component primitives
- **class-variance-authority** - Component variants
- **clsx** - Conditional class names
- **tailwind-merge** - Tailwind class merging
- **tailwindcss-animate** - Animation utilities

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- Supabase project created
- Environment variables configured

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/adeyinka-bakare-foundation.git
cd adeyinka-bakare-foundation
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

4. **Run database migrations**
Copy the migration file from `supabase/migrations/20261003_initial_schema.sql` and run it in your Supabase SQL editor.

5. **Start the development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## 🗄️ Database Schema

The application uses Supabase PostgreSQL with the following main tables:

- **profiles** - User profiles and role assignments
- **members** - Fellowship members
- **volunteers** - Volunteers
- **beneficiaries** - Scholarship beneficiaries
- **programmes** - Academic programmes
- **testimonials** - Member testimonials
- **events** - Fellowship events
- **news** - News and updates
- **contents** - Site-wide content management
- **footer_sections** - Footer sections
- **footer_links** - Footer links
- **social_links** - Social media links
- **settings** - Application settings
- **notifications** - User notifications
- **admins** - Admin users
- **security_configs** - Security settings (TOTP, passkeys, recovery codes)

See `supabase/migrations/20261003_initial_schema.sql` for the complete schema.

## 🔐 Security Features

### Authentication
- Email/password authentication via Supabase Auth
- Session management with secure HTTP-only cookies
- Automatic token refresh

### Multi-Factor Authentication
- TOTP (Time-based One-Time Password) support
- Passkey (WebAuthn) for passwordless login
- Recovery codes for account recovery
- QR code generation for TOTP setup

### Authorization
- Role-based access control (Admin, Member, Volunteer)
- Row-Level Security (RLS) policies in Supabase
- Middleware-based route protection
- API route authentication checks

### Data Protection
- Encrypted secrets storage
- Secure file uploads with signed URLs
- Input validation with Zod schemas
- SQL injection prevention via parameterized queries

## 📝 API Routes

### Public Routes
- `GET /api/public/volunteers` - Volunteer registration

### Admin Routes
- `GET/POST /api/admin/members` - Member management
- `GET/POST /api/admin/beneficiaries` - Beneficiary management
- `GET/POST /api/admin/programmes` - Programme management
- `GET/POST /api/admin/events` - Event management
- `GET/POST /api/admin/news` - News management
- `GET/POST /api/admin/testimonials` - Testimonial management
- `GET/POST /api/admin/volunteers` - Volunteer management
- `GET/POST /api/admin/contents` - Content management
- `GET/POST /api/admin/footer/sections` - Footer section management
- `GET/POST /api/admin/footer/links` - Footer link management
- `GET/POST /api/admin/social-links` - Social link management
- `GET/POST /api/admin/settings` - Settings management
- `GET/POST /api/admin/notifications` - Notification management
- `GET/POST /api/admin/admins` - Admin management
- `GET/POST /api/admin/media` - Media management
- `POST /api/admin/media/upload-url` - Generate upload URL

### Security Routes
- `POST /api/admin/security/totp/setup` - Setup TOTP
- `POST /api/admin/security/totp/verify` - Verify TOTP
- `POST /api/admin/security/totp/disable` - Disable TOTP
- `POST /api/admin/security/passkeys/register` - Register passkey
- `POST /api/admin/security/passkeys/authenticate` - Authenticate with passkey
- `POST /api/admin/security/recovery-codes/generate` - Generate recovery codes
- `POST /api/admin/security/recovery-codes/regenerate` - Regenerate recovery codes

## 🎯 Pages

### Public Pages
- `/` - Homepage
- `/about` - About ABF
- `/programmes` - Programmes overview
- `/programmes/[slug]` - Programme details
- `/beneficiaries` - Beneficiaries
- `/beneficiaries/[id]` - Beneficiary details
- `/testimonials` - Testimonials
- `/events` - Events
- `/events/[slug]` - Event details
- `/news` - News
- `/news/[slug]` - News article
- `/get-involved` - Get involved
- `/contact` - Contact

### Admin Pages
- `/admin` - Dashboard
- `/admin/members` - Member management
- `/admin/beneficiaries` - Beneficiary management
- `/admin/programmes` - Programme management
- `/admin/events` - Event management
- `/admin/news` - News management
- `/admin/testimonials` - Testimonial management
- `/admin/volunteers` - Volunteer management
- `/admin/media` - Media library
- `/admin/contents` - Content management
- `/admin/footer` - Footer management
- `/admin/social-links` - Social links
- `/admin/settings` - Settings
- `/admin/notifications` - Notifications
- `/admin/admins` - Admin management
- `/admin/security` - Security settings

### Auth Pages
- `/auth/login` - Login
- `/auth/callback` - OAuth callback
- `/auth/mfa` - Multi-factor authentication

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms
Ensure the platform supports:
- Node.js 18+
- Edge functions or serverless functions
- Environment variables
- Static file serving

## 📄 License

This project is proprietary and confidential.

## 👥 Contact

For questions or support, please contact the ABF administration.

---
