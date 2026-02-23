# Supabase Integration for Booking SaaS

## ✅ Setup Already Configured!

Great news! Your Supabase credentials have already been configured in the `.env.local` file:
- **Project URL**: `https://mfnkhsxgfjlljwlotkvi.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 🚀 Quick Start Guide

### 1. Run the SQL Script in Supabase
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/mfnkhsxgfjlljwlotkvi)
2. Navigate to **SQL Editor** (left sidebar).
3. Click **"New query"**.
4. Copy the entire content from `supabase_setup.sql` in this project.
5. Paste into SQL Editor and click **"Run"** (or press CMD/CTRL+Enter).
6. You should see confirmation messages and data counts.

### 2. Start Your Application
```bash
npm run dev
```
Visit `http://localhost:5173` and click **"Demo Salonas"** or go directly to `/NaujasSalonas`.

The application is now fully connected to your Supabase database!

## 📊 Database Schema Overview

The SQL script creates 3 tables:

### `salons`
- Stores salon information
- Each salon has a unique `slug` (e.g., "NaujasSalonas")
- Contains working hours, description, logo URL

### `services`
- Stores services offered by each salon
- Linked to salons via `salon_id` foreign key
- Contains name, duration (minutes), price

### `bookings`
- Stores customer bookings
- Linked to both salons and services
- Contains customer contact info, date, time

### Row Level Security (RLS)
- Public can read all data
- Public can insert bookings (for customers to book)
- No authentication required for this demo

## 🔧 Adding More Salons

To add another salon to your SaaS platform:

1. Insert into `salons` table:
```sql
INSERT INTO salons (slug, name, description, working_hours_open, working_hours_close)
VALUES ('another-salon', 'Another Salon', 'Description...', '08:00', '17:00');
```

2. Get the salon ID, then insert services:
```sql
INSERT INTO services (salon_id, name, duration, price)
VALUES ('salon-uuid-here', 'Service Name', 60, 50);
```

3. Your React app will automatically handle the route: `/another-salon`

## 🛠️ Troubleshooting

### "Missing Supabase environment variables" warning
- Check that `.env.local` file exists with correct values
- Restart the dev server after changing env vars: `npm run dev`

### "Network error" or CORS issues
- In Supabase dashboard, go to **Authentication** > **URL Configuration**
- Add `http://localhost:5173` to "Additional Redirect URLs"

### Data not loading
- Check browser console for errors
- Verify tables were created in Supabase Table Editor
- Ensure RLS policies allow public read access

### Booking not saving
- Check network tab in browser devtools
- Verify `bookings` table has INSERT policy for public

## 🚀 Next Steps for Production

1. **Authentication**: Add user authentication for salon owners
2. **Admin Dashboard**: Create admin interface for salon management  
3. **Email Notifications**: Integrate email service for confirmations
4. **Payment Processing**: Add Stripe or other payment gateway
5. **Advanced Features**: Recurring bookings, staff management, analytics

## 📁 Files Overview

- `supabase_setup.sql` - Complete database setup script
- `.env.local` - Environment variables (already configured)
- `src/lib/supabase.ts` - Supabase client configuration
- `src/pages/SalonPage.tsx` - Main booking page with Supabase integration
- `src/types/index.ts` - TypeScript types for database and app