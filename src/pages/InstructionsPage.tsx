import { Link } from "react-router-dom";
import { ArrowLeft, Database, Mail, Calendar, Key, Settings, Server, ShieldCheck, CheckCircle2, ExternalLink } from "lucide-react";

export function InstructionsPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans pb-24 selection:bg-stone-200">
      <nav className="border-b border-stone-200 bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link
            to="/"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-100 transition"
          >
            <ArrowLeft className="w-5 h-5 text-stone-700" />
          </Link>
          <div className="font-semibold text-lg tracking-tight">
            SaaS Instrukcijos
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-stone-900 text-white rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-stone-200">
            <Settings className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Integracijų ir duomenų bazės sąranka</h1>
          <p className="text-stone-500 text-lg leading-relaxed">
            Išsamus gidas, kaip prijungti Supabase duomenų bazę, Google Calendar bei Gmail integracijas.
          </p>
        </div>

        {/* SUPABASE SEKCIJA */}
        <section className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
            <div className="flex items-center gap-4">
              <Database className="w-10 h-10" />
              <div>
                <h2 className="text-2xl font-bold">Supabase duomenų bazė</h2>
                <p className="text-emerald-100">Pilna SQL schema ir mock duomenys</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {/* Step 1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <h3 className="font-semibold text-lg">Sukurkite Supabase projektą</h3>
              </div>
              <div className="ml-11 space-y-3 text-stone-600">
                <p>1. Eikite į <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline inline-flex items-center gap-1">supabase.com <ExternalLink className="w-4 h-4" /></a> ir prisijunkite</p>
                <p>2. Spauskite <strong>"New Project"</strong> ir sukurkite naują projektą</p>
                <p>3. Pasirinkite regioną arčiausiai Lietuvos (pvz., Frankfurt)</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <h3 className="font-semibold text-lg">Sukurkite duomenų bazės lenteles</h3>
              </div>
              <div className="ml-11 space-y-3">
                <p className="text-stone-600">Eikite į <strong>SQL Editor</strong> (šoninis meniu) ir įvykdykite šį SQL:</p>
                <div className="bg-stone-900 text-stone-300 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-96">
                  <pre>{`-- 1. SALONŲ LENTELĖ
CREATE TABLE IF NOT EXISTS salons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  logo TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  working_hours_open TEXT NOT NULL DEFAULT '09:00',
  working_hours_close TEXT NOT NULL DEFAULT '18:00',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PASLAUGŲ LENTELĖ
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  duration INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. REZERVACIJŲ LENTELĖ
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  end_time TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. RLS POLITIKOS
ALTER TABLE salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read salons" ON salons FOR SELECT USING (true);
CREATE POLICY "Public read services" ON services FOR SELECT USING (true);
CREATE POLICY "Public read bookings" ON bookings FOR SELECT USING (true);
CREATE POLICY "Public insert bookings" ON bookings FOR INSERT WITH CHECK (true);

-- 5. INDEKSAI
CREATE INDEX IF NOT EXISTS idx_services_salon_id ON services(salon_id);
CREATE INDEX IF NOT EXISTS idx_bookings_salon_id ON bookings(salon_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);`}</pre>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <h3 className="font-semibold text-lg">Įterpkite mock duomenis (NaujasSalonas)</h3>
              </div>
              <div className="ml-11 space-y-3">
                <p className="text-stone-600">Tolesniame SQL sugeneruosite demo saloną su paslaugomis:</p>
                <div className="bg-stone-900 text-stone-300 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-80">
                  <pre>{`-- DEMO SALONAS
INSERT INTO salons (id, slug, name, description, logo, address, phone, email, working_hours_open, working_hours_close)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'NaujasSalonas',
  'Glow Beauty',
  'Elegantiškas grožio salonas, kuriame pasirūpinsime jūsų išvaizda.',
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=200&h=200',
  'Gedimino pr. 15, Vilnius',
  '+370 600 12345',
  'info@glowbeauty.lt',
  '09:00',
  '18:00'
);

-- PASLAUGOS
INSERT INTO services (salon_id, name, duration, price) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Moteriškas kirpimas', 60, 45.00),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Plaukų dažymas', 120, 80.00),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Manikiūras', 45, 25.00),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Pedikiūras', 60, 35.00),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Veido valymas', 90, 55.00);`}</pre>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm">4</div>
                <h3 className="font-semibold text-lg">Gaukite API raktus</h3>
              </div>
              <div className="ml-11 space-y-3 text-stone-600">
                <p>1. Eikite į <strong>Project Settings → API</strong></p>
                <p>2. Nukopijuokite <strong>Project URL</strong> (pvz., https://xxxx.supabase.co)</p>
                <p>3. Nukopijuokite <strong>anon public</strong> raktą (ilgas JWT tokenas)</p>
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-sm mt-4">
                  <strong>⚠️ Dėmesio:</strong> Raktai <code>sb_publishable_...</code> nėra Supabase raktai. 
                  Teisingi Supabase raktai prasideda su <code>eyJ</code> (JWT formatas).
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm">5</div>
                <h3 className="font-semibold text-lg">Sukonfigūruokite .env.local failą</h3>
              </div>
              <div className="ml-11 space-y-3">
                <p className="text-stone-600">Projekto šaknyje sukurkite failą <code>.env.local</code>:</p>
                <div className="bg-stone-900 text-stone-300 p-4 rounded-xl text-sm font-mono">
                  <pre>{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...`}</pre>
                </div>
                <p className="text-stone-500 text-sm mt-2">Perkraukite development serverį po pakeitimų!</p>
              </div>
            </div>
          </div>
        </section>

        {/* GOOGLE CLOUD SEKCIJA */}
        <section className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
              G
            </div>
            <div>
              <h2 className="text-xl font-bold">Google Cloud integracijos</h2>
              <p className="text-stone-500 text-sm mt-1">Gmail ir Google Calendar API sąranka</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <h3 className="font-semibold text-lg">Google Cloud Console paruošimas</h3>
              </div>
              <div className="ml-11 space-y-3 text-stone-600">
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-stone-400 mt-0.5 flex-shrink-0" />
                  Eikite į <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-stone-400 mt-0.5 flex-shrink-0" />
                  Sukurkite naują projektą (Pvz: "Booking SaaS")
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-stone-400 mt-0.5 flex-shrink-0" />
                  Įjunkite API: <strong>APIs & Services → Library</strong> → suraskite ir įjunkite:
                  <br /><span className="bg-stone-100 px-2 py-1 rounded font-mono text-sm mt-2 inline-block">Gmail API</span>
                  <br /><span className="bg-stone-100 px-2 py-1 rounded font-mono text-sm mt-1 inline-block">Google Calendar API</span>
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <h3 className="font-semibold text-lg">OAuth 2.0 kredencialai</h3>
              </div>
              <div className="ml-11 space-y-3 text-stone-600">
                <p className="flex items-start gap-2">
                  <ShieldCheck className="w-5 h-5 text-stone-400 mt-0.5 flex-shrink-0" />
                  Eikite į <strong>APIs & Services → Credentials</strong>
                </p>
                <p className="flex items-start gap-2">
                  <Key className="w-5 h-5 text-stone-400 mt-0.5 flex-shrink-0" />
                  Spauskite <strong>Create Credentials → OAuth client ID</strong>
                </p>
                <p className="flex items-start gap-2">
                  <Settings className="w-5 h-5 text-stone-400 mt-0.5 flex-shrink-0" />
                  Application type: <strong>Web application</strong>
                </p>
                <p className="flex items-start gap-2">
                  <Server className="w-5 h-5 text-stone-400 mt-0.5 flex-shrink-0" />
                  Redirect URI: <code className="bg-stone-100 px-2 py-0.5 rounded">https://developers.google.com/oauthplayground</code>
                </p>
                <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl mt-4">
                  <p className="font-medium mb-2">Išsaugokite .env faile:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm font-mono text-stone-600">
                    <li>GOOGLE_CLIENT_ID=...</li>
                    <li>GOOGLE_CLIENT_SECRET=...</li>
                    <li>GOOGLE_REFRESH_TOKEN=...</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Code examples */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <section className="border border-stone-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-6 h-6 text-rose-500" />
                  <h3 className="font-semibold">Gmail API (Nodemailer)</h3>
                </div>
                <div className="bg-stone-900 text-stone-300 p-4 rounded-xl text-xs font-mono overflow-x-auto">
                  <pre>{`npm install nodemailer googleapis

const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN
  }
});`}</pre>
                </div>
              </section>

              <section className="border border-stone-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-blue-500" />
                  <h3 className="font-semibold">Google Calendar API</h3>
                </div>
                <div className="bg-stone-900 text-stone-300 p-4 rounded-xl text-xs font-mono overflow-x-auto">
                  <pre>{`npm install googleapis

const { google } = require('googleapis');
const calendar = google.calendar({ 
  version: 'v3', 
  auth: oauth2Client 
});

const event = {
  summary: 'Vizitas: Plaukų dažymas',
  start: {
    dateTime: '2024-01-20T10:00:00',
    timeZone: 'Europe/Vilnius',
  },
  end: {
    dateTime: '2024-01-20T11:00:00',
    timeZone: 'Europe/Vilnius',
  },
};

calendar.events.insert({
  calendarId: 'primary',
  resource: event,
});`}</pre>
                </div>
              </section>
            </div>
          </div>
        </section>

        {/* EMAILJS SEKCIJA */}
        <section className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-6 text-white">
            <div className="flex items-center gap-4">
              <Mail className="w-10 h-10" />
              <div>
                <h2 className="text-2xl font-bold">EmailJS el. laiškų siuntimas</h2>
                <p className="text-rose-100">Automatiniai patvirtinimo laiškai klientams</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {/* Introduction */}
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-rose-800">
              <p className="font-medium mb-1">✉️ Siunčiate iš: littlenestprintables.inc@gmail.com</p>
              <p className="text-sm">EmailJS leidžia siųsti el. laiškus tiesiogiai iš React aplikacijos be serverio. Nemokamai galima siųsti iki 200 laiškų per mėnesį.</p>
            </div>

            {/* Step 1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <h3 className="font-semibold text-lg">Sukurkite EmailJS paskyrą</h3>
              </div>
              <div className="ml-11 space-y-3 text-stone-600">
                <p>1. Eikite į <a href="https://www.emailjs.com/" target="_blank" rel="noreferrer" className="text-rose-600 hover:underline inline-flex items-center gap-1">emailjs.com <ExternalLink className="w-4 h-4" /></a></p>
                <p>2. Užsiregistruokite (galima su Google paskyra)</p>
                <p>3. Prisijunkite prie dashboard</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <h3 className="font-semibold text-lg">Sukurkite Email Service</h3>
              </div>
              <div className="ml-11 space-y-3 text-stone-600">
                <p>1. Eikite į <strong>Email Services</strong> ir spauskite <strong>Add New Service</strong></p>
                <p>2. Pasirinkite <strong>Gmail</strong></p>
                <p>3. Sukurkite pavadinimą: <code className="bg-stone-100 px-2 py-0.5 rounded">gmail_service</code></p>
                <p>4. Paspauskite <strong>Connect Account</strong> ir prisijunkite su:</p>
                <div className="bg-stone-100 p-3 rounded-lg font-mono text-sm mt-2">
                  littlenestprintables.inc@gmail.com
                </div>
                <p>5. Išsaugokite <strong>Service ID</strong> (reikės vėliau)</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <h3 className="font-semibold text-lg">Sukurkite Email Template</h3>
              </div>
              <div className="ml-11 space-y-3">
                <p className="text-stone-600">Eikite į <strong>Email Templates</strong> ir sukurkite naują šabloną:</p>
                <div className="bg-stone-900 text-stone-300 p-4 rounded-xl text-xs font-mono overflow-x-auto">
                  <pre>{`Subject: ✅ Jūsų vizitas patvirtintas - {{salon_name}}

Sveiki {{to_name}},

Džiaugiamės patvirtinti jūsų rezervaciją!

📅 VIZITO INFORMACIJA:
━━━━━━━━━━━━━━━━━━━━━━
Salonas: {{salon_name}}
Paslauga: {{service_name}}
Data: {{booking_date}}
Laikas: {{booking_time}}
Trukmė: {{duration}} min.
Kaina: {{price}}€

📍 ADRESAS:
{{salon_address}}

📞 KONTAKTAI:
Tel.: {{salon_phone}}

Jei turite klausimų ar norite pakeisti rezervaciją, 
prašome susisiekti su salonu.

Iki pasimatymo!
{{salon_name}} komanda`}</pre>
                </div>
                <p className="text-stone-500 text-sm mt-2">Išsaugokite <strong>Template ID</strong> (reikės vėliau)</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center font-bold text-sm">4</div>
                <h3 className="font-semibold text-lg">Gaukite Public Key</h3>
              </div>
              <div className="ml-11 space-y-3 text-stone-600">
                <p>1. Eikite į <strong>Account → General</strong></p>
                <p>2. Raskite <strong>Public Key</strong> sekciją</p>
                <p>3. Nukopijuokite raktą (prasideda su didžiosiomis raidėmis)</p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center font-bold text-sm">5</div>
                <h3 className="font-semibold text-lg">Sukonfigūruokite .env.local</h3>
              </div>
              <div className="ml-11 space-y-3">
                <p className="text-stone-600">Pridėkite šiuos kintamuosius prie savo <code>.env.local</code>:</p>
                <div className="bg-stone-900 text-stone-300 p-4 rounded-xl text-sm font-mono">
                  <pre>{`# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=XXXXXXXXXXXXXXXXXXXXXX`}</pre>
                </div>
                <div className="bg-green-50 border border-green-200 p-4 rounded-xl text-green-800 text-sm mt-4">
                  <p className="font-medium">✅ Pavyzdinis konfigūracija:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li><strong>Service ID:</strong> service_gmail123</li>
                    <li><strong>Template ID:</strong> template_booking</li>
                    <li><strong>Public Key:</strong> AbCdEfGhIjKlMnOpQrStUv</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Code Example */}
            <div className="bg-stone-50 p-6 rounded-xl border border-stone-200">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Naudojimas kode
              </h4>
              <div className="bg-stone-900 text-stone-300 p-4 rounded-xl text-xs font-mono overflow-x-auto">
                <pre>{`// Siųsti el. laišką po rezervacijos
import { sendBookingConfirmationEmail } from '../lib/email';

const emailData = {
  to_email: 'klientas@email.com',
  to_name: 'Vardenis Pavardenis',
  salon_name: 'Glow Beauty',
  service_name: 'Moteriškas kirpimas',
  booking_date: '2024-01-20',
  booking_time: '10:00',
  duration: 60,
  price: 45,
  salon_address: 'Gedimino pr. 15, Vilnius',
  salon_phone: '+370 600 12345'
};

await sendBookingConfirmationEmail(emailData);
// ✅ Laiškas išsiųstas iš littlenestprintables.inc@gmail.com`}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* GITHUB HOSTING SEKCIJA */}
        <section className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="bg-gradient-to-r from-slate-700 to-slate-900 p-6 text-white">
            <div className="flex items-center gap-4">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <div>
                <h2 className="text-2xl font-bold">GitHub Pages hosting</h2>
                <p className="text-slate-300">Nemokamas statinių svetainių talpinimas</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {/* Step 1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <h3 className="font-semibold text-lg">Sukurkite GitHub repozitoriją</h3>
              </div>
              <div className="ml-11 space-y-3 text-stone-600">
                <p>1. Eikite į <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-slate-600 hover:underline inline-flex items-center gap-1">github.com/new <ExternalLink className="w-4 h-4" /></a></p>
                <p>2. Pavadinkite repozitoriją: <code className="bg-stone-100 px-2 py-0.5 rounded">booking-saas</code></p>
                <p>3. Pasirinkite <strong>Public</strong></p>
                <p>4. Nepažymėkite "Initialize this repository with a README"</p>
                <p>5. Spauskite <strong>Create repository</strong></p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <h3 className="font-semibold text-lg">Įkelkite kodą į GitHub</h3>
              </div>
              <div className="ml-11 space-y-3">
                <p className="text-stone-600">Terminale projekto aplanko viduje paleiskite:</p>
                <div className="bg-stone-900 text-stone-300 p-4 rounded-xl text-sm font-mono">
                  <pre>{`# Inicializuokite Git
git init

# Pridėkite visus failus
git add .

# Sukurkite pirmą commit
git commit -m "Initial commit"

# Pridėkite GitHub repozitoriją (pakeiskite USERNAME!)
git remote add origin https://github.com/USERNAME/booking-saas.git

# Įkelkite kodą
git push -u origin main`}</pre>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <h3 className="font-semibold text-lg">Įgalinkite GitHub Pages</h3>
              </div>
              <div className="ml-11 space-y-3 text-stone-600">
                <p>1. GitHub repozitorijoje eikite į <strong>Settings</strong> tab</p>
                <p>2. Kairiame meniu pasirinkite <strong>Pages</strong></p>
                <p>3. <strong>Source</strong> sekcijoje pasirinkite:</p>
                <div className="bg-stone-100 p-3 rounded-lg font-mono text-sm mt-2">
                  Deploy from a branch → main → / (root)
                </div>
                <p>4. Spauskite <strong>Save</strong></p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center font-bold text-sm">4</div>
                <h3 className="font-semibold text-lg">Sukonfigūruokite Vite GitHub Pages</h3>
              </div>
              <div className="ml-11 space-y-3">
                <p className="text-stone-600">Atidarykite <code>vite.config.ts</code> ir pridėkite <code>base</code>:</p>
                <div className="bg-stone-900 text-stone-300 p-4 rounded-xl text-xs font-mono">
                  <pre>{`import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/booking-saas/',  // ← Pridėkite šią eilutę!
})`}</pre>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-sm mt-4">
                  <p className="font-medium">⚠️ Svarbu!</p>
                  <p>Jei naudojate custom domain (pvz., manosvetaine.lt), naudokite <code>base: '/'</code></p>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center font-bold text-sm">5</div>
                <h3 className="font-semibold text-lg">Sukurkite deploy workflow</h3>
              </div>
              <div className="ml-11 space-y-3">
                <p className="text-stone-600">Sukurkite failą <code>.github/workflows/deploy.yml</code>:</p>
                <div className="bg-stone-900 text-stone-300 p-4 rounded-xl text-xs font-mono overflow-x-auto">
                  <pre>{`name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: \${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist`}</pre>
                </div>
              </div>
            </div>

            {/* Step 6 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center font-bold text-sm">6</div>
                <h3 className="font-semibold text-lg">Patikrinkite rezultatą</h3>
              </div>
              <div className="ml-11 space-y-3 text-stone-600">
                <p>1. Įkelkite pakeitimus į GitHub:</p>
                <div className="bg-stone-900 text-stone-300 p-3 rounded-xl text-sm font-mono">
                  <pre>{`git add .
git commit -m "Add GitHub Pages config"
git push`}</pre>
                </div>
                <p>2. Eikite į <strong>Actions</strong> tab repozitorijoje</p>
                <p>3. Palaukite kol workflow baigsis (žalias varnelė)</p>
                <p>4. Jūsų svetainė bus pasiekiama:</p>
                <div className="bg-green-100 p-3 rounded-lg font-mono text-sm text-green-800">
                  https://USERNAME.github.io/booking-saas/
                </div>
              </div>
            </div>

            {/* Environment Variables */}
            <div className="bg-stone-50 p-6 rounded-xl border border-stone-200">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Aplinkos kintamųjų nustatymas GitHub
              </h4>
              <p className="text-stone-600 text-sm mb-3">
                Kadangi GitHub Pages nepalaiko server-side kintamųjų, jūs turite du pasirinkimus:
              </p>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-lg border border-stone-200">
                  <p className="font-medium text-sm">1️⃣ Variantas: Hardcodinti raktus (tik demo/testavimui)</p>
                  <p className="text-xs text-stone-500 mt-1">
                    Redaguokite <code>src/lib/supabase.ts</code> ir įrašykite raktus tiesiogiai į kodą. 
                    <strong className="text-red-600"> Nerekomenduojama produkcijai!</strong>
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-stone-200">
                  <p className="font-medium text-sm">2️⃣ Variantas: Naudoti GitHub Secrets (saugiau)</p>
                  <p className="text-xs text-stone-500 mt-1">
                    Eikite į Settings → Secrets and variables → Actions → New repository secret
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PASTABOS */}
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-2xl text-yellow-800 text-sm">
          <p className="font-semibold mb-2">💡 Svarbi informacija:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Multi-tenant SaaS sistemoje kiekvienas salonas turi turėti savo OAuth credentials</li>
            <li>Duomenų bazėje saugokite kiekvieno salono <code>refresh_token</code></li>
            <li>Visada naudokite aplinkos kintamuosius (.env) slaptiems raktams</li>
            <li>Prieš paleidžiant į gamybą, patikrinkite RLS politikas Supabase</li>
            <li>EmailJS nemokamas planas: 200 laiškų/mėn</li>
            <li>GitHub Pages nemokamas planas: 1GB talpykla, 100GB per mėnesį</li>
          </ul>
        </div>

        {/* Back link */}
        <div className="text-center pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Grįžti į pagrindinį puslapį
          </Link>
        </div>
      </main>
    </div>
  );
}
