# Amazon Clone Platform

A full-stack, high-fidelity e-commerce application inspired by Amazon. This platform features robust user authentication, product discovery, a shopping cart, a wishlist, order history, and AI-powered product insights using Google Gemini. 

## 🚀 Tech Stack

- **Frontend Framework**: Next.js 15 (App Router, Server Components & Server Actions)
- **Styling**: Tailwind CSS & Framer Motion (micro-animations)
- **Database & Authentication**: Supabase (PostgreSQL, Supabase Auth via `@supabase/ssr`)
- **AI Integration**: Google GenAI (`@google/genai`) for "Ask Rufus"-style summaries and insights.
- **Email Service**: Nodemailer for transactional emails (order confirmations, notifications).
- **Icons**: Lucide React

## 📂 Project Structure

The repository is divided into two primary directories:

- `/frontend` - Contains the Next.js application, including all UI components, pages (App Router), hooks, lib utilities, and server actions.
- `/backend/supabase_migrations` - Contains raw SQL scripts for setting up the Supabase PostgreSQL database schema, RLS policies, and seating initial mock data.

## 🛠️ Setup Instructions

### 1. Prerequisites
- **Node.js** (v18 or higher)
- A **Supabase** account to host your PostgreSQL database and manage authentication.
- A **Google Gemini API Key** for AI features.
- An **SMTP Provider** (like Gmail, Brevo, SendGrid) to power `nodemailer`.

### 2. Backend Setup (Database Schema & Seeding)

The application requires a specific database structure to function correctly. 

1. Create a new project in your [Supabase Dashboard](https://supabase.com).
2. Navigate to the **SQL Editor** in your Supabase project.
3. Run the SQL scripts found in `backend/supabase_migrations` in the following order:
   - `01_frontend_schema_and_seed.sql` (Creates core product/user tables and inserts robust mockup data)
   - `02_cart_schema.sql` (Creates cart-related tables & RLS policies)
   - `03_orders_schema.sql` (Sets up order history and transaction tracing)
   - `04_wishlist_schema.sql` (Sets up wishlist functionality and persistence)

*(See the Assumptions section below for details on how data is seeded).*

### 3. Frontend Setup & Environment Variables

Open your terminal and navigate to the `frontend` directory:

```bash
cd frontend
npm install
```

Create a new file named `.env.local` inside the `frontend` directory based on the following template. Fill in the required strings:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini (AI Features)
GEMINI_API_KEY=your_gemini_api_key

# Nodemailer Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587 # or 465
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
```

### 4. Run the Application locally

Once dependencies are installed and `.env.local` is configured, spin up the development server:

```bash
npm run dev
```

The application will be running at `http://localhost:3000`.

---

## 🧠 Key Assumptions & Implementation Architecture

### Data Mockup and Seeding
- **Assumption:** The application does not currently feature an Admin Dashboard for creating or managing products.
- **Implementation:** The entire initial product catalog, categories, product specifications, and images are seeded directly via SQL (`01_frontend_schema_and_seed.sql`). 
- **Maintenance:** To add new products or categories, developers must manually run `INSERT` statements in the Supabase SQL editor or modify the initial seed file to reflect the new state and re-provision the database.

### Emailing Architecture
- **Assumption:** The app relies on traditional SMTP for outgoing transactional communications (like purchase receipts) rather than proprietary APIs (like Resend or Postmark SDKs).
- **Implementation:** `nodemailer` handles sending emails. It's invoked via Next.js API Routes or Server Actions (e.g., executing after an order is successfully finalized in the database).
- **Setup Reality:** The developer is responsible for passing correct SMTP transporter credentials into their `.env.local`. If a user attempts to use a standard Gmail account, they **must** create an "App Password" in their Google Account security settings, as standard passwords will be rejected by Google's SMTP servers.

### Authentication Flow
- **Assumption:** The application relies exclusively on Supabase for Auth state across both client-side and server-side logic.
- **Implementation:** It utilizes `@supabase/ssr` to securely store JWTs in cookies. This allows Server Components to read the user's session natively without causing hydration errors or layout shifts on load. Setup assumes that Supabase's Site URL & Redirect URLs are correctly matched to the deployment environment.
