# 🏢 Booking SaaS - Multi-tenant Reservation System

Moderni daugiabučių salonų rezervacijos sistema su Supabase duomenų baze ir EmailJS el. laiškų integracija.

[![Deploy to GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-blue?logo=github)](https://pages.github.com/)
[![EmailJS](https://img.shields.io/badge/Email-EmailJS-FF6B6B?logo=mail.ru)](https://www.emailjs.com/)
[![Supabase](https://img.shields.io/badge/DB-Supabase-3ECF8E?logo=supabase)](https://supabase.com/)

## 🚀 Funkcijos

- ✅ **Multi-tenant architektūra** - Kiekvienas salonas turi unikalią nuorodą (`/salonSlug`)
- ✅ **Supabase integracija** - Realaus laiko duomenų bazė PostgreSQL
- ✅ **Automatiniai el. laiškai** - EmailJS patvirtinimo laiškai po rezervacijos
- ✅ **Google Calendar** - Pridėti vizitą į kalendorių
- ✅ **Lietuviška kalba** - Pilnas lokalizavimas
- ✅ **Mobile-first dizainas** - Optimizuota mobiliesiems įrenginiams
- ✅ **GitHub Pages hosting** - Nemokamas talpinimas

## 📁 Projekto struktūra

```
booking-saas/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment
├── src/
│   ├── lib/
│   │   ├── supabase.ts         # Supabase klientas ir funkcijos
│   │   └── email.ts            # EmailJS siuntimo logika
│   ├── pages/
│   │   ├── SalonPage.tsx       # Pagrindinis rezervacijos puslapis
│   │   └── InstructionsPage.tsx # Integracijų instrukcijos
│   ├── types/
│   │   └── index.ts            # TypeScript tipai
│   ├── App.tsx                 # Pagrindinis komponentas
│   └── main.tsx                # Entry point
├── .env.local                  # Aplinkos kintamieji (nepush'inami!)
├── supabase-schema.sql         # SQL schema duomenų bazei
├── vite.config.ts              # Vite konfigūracija
└── README.md                   # Šis failas
```

## 🛠️ Diegimas

### 1. Klonuokite repozitoriją

```bash
git clone https://github.com/USERNAME/booking-saas.git
cd booking-saas
```

### 2. Įdiekite priklausomybes

```bash
npm install
```

### 3. Sukonfigūruokite aplinkos kintamuosius

Sukurkite `.env.local` failą projekto šaknyje:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://mfnkhsxgfjlljwlotkvi.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mbmtoc3hnZmpsbGp3bG90a3ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NTExNzcsImV4cCI6MjA4NzQyNzE3N30.roYg8Is9opaBZQAQ8AyvnMUXFV6uLhH9ZsGRSW5YbgY

# EmailJS Configuration (dėl laiškų siuntimo)
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### 4. Paleiskite development serverį

```bash
npm run dev
```

Atidarykite [http://localhost:5173](http://localhost:5173)

## 📧 EmailJS Konfigūracija

Kad sistema siųstų patvirtinimo laiškus klientams:

1. **Sukurkite paskyrą** [emailjs.com](https://www.emailjs.com/)
2. **Pridėkite Gmail servisą** ir prisijunkite su: `littlenestprintables.inc@gmail.com`
3. **Sukurkite email template**:

```
Subject: ✅ Jūsų vizitas patvirtintas - {{salon_name}}

Sveiki {{to_name}},

Jūsų rezervacija patvirtinta!

📅 Vizito informacija:
• Salonas: {{salon_name}}
• Paslauga: {{service_name}}
• Data: {{booking_date}}
• Laikas: {{booking_time}}
• Trukmė: {{duration}} min.
• Kaina: {{price}}€

📍 Adresas: {{salon_address}}
📞 Tel.: {{salon_phone}}

Iki pasimatymo!
```

4. **Įrašykite Service ID, Template ID ir Public Key** į `.env.local`

## 🗄️ Supabase SQL Schema

Paleiskite šį SQL savo Supabase projekte:

```sql
-- Salonų lentelė
CREATE TABLE salons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  logo TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  working_hours_open TEXT NOT NULL DEFAULT '09:00',
  working_hours_close TEXT NOT NULL DEFAULT '18:00'
);

-- Paslaugų lentelė
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  duration INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0
);

-- Rezervacijų lentelė
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  end_time TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  status TEXT DEFAULT 'confirmed'
);

-- RLS politikos
ALTER TABLE salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read salons" ON salons FOR SELECT USING (true);
CREATE POLICY "Public read services" ON services FOR SELECT USING (true);
CREATE POLICY "Public read bookings" ON bookings FOR SELECT USING (true);
CREATE POLICY "Public insert bookings" ON bookings FOR INSERT WITH CHECK (true);
```

## 📦 GitHub Pages Deployment

### Automatinis deployment

Kiekvienas `git push` į `main` šaką automatiškai sukurs ir įdiegs jūsų svetainę.

### Rankinis deployment

1. Eikite į GitHub repozitoriją
2. Atidarykite **Actions** tab
3. Pasirinkite **Deploy to GitHub Pages** workflow
4. Spauskite **Run workflow**

### Svetainės adresas

Po deploymento svetainė bus pasiekiama:

```
https://USERNAME.github.io/booking-saas/
```

## 🎯 Naudojimas

### Demo salonas

Aplankykite demo saloną:
```
https://USERNAME.github.io/booking-saas/NaujasSalonas
```

### Naujo salono pridėjimas

1. Pridėkite saloną į Supabase `salons` lentelę
2. Pridėkite paslaugas į `services` lentelę
3. Salonas bus pasiekiamas per: `/salono-slug`

## 🛡️ Saugumas

- ✅ Row Level Security (RLS) politikos Supabase
- ✅ Aplinkos kintamieji slaptiems raktams
- ✅ Input validacija formose
- ✅ SQL injection prevencija per Supabase ORM

## 📱 Palaikomos naršyklės

- Chrome (90+)
- Firefox (88+)
- Safari (14+)
- Edge (90+)

## 📝 Licencija

MIT License - nemokamas naudojimas asmeniniams ir komerciniams projektams.

## 🆘 Pagalba

Jei turite klausimų arba radote klaidą:

1. Patikrinkite [Instructions Page](https://USERNAME.github.io/booking-saas/instrukcijos)
2. Sukurkite [GitHub Issue](https://github.com/USERNAME/booking-saas/issues)

---

Sukurta su ❤️ Lietuvoje
