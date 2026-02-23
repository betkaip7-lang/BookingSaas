import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Calendar, Key, Settings, Server, ShieldCheck, CheckCircle2 } from "lucide-react";

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
            SaaS Integracijų Instrukcija
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-stone-900 text-white rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-stone-200">
            <Settings className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Kaip prijungti Google Calendar ir Gmail integracijas?</h1>
          <p className="text-stone-500 text-lg leading-relaxed">
            Šioje instrukcijoje aprašytas standartinis būdas, kaip SaaS aplikacijoje sukonfigūruoti automatinius el. laiškus per Gmail ir kalendoriaus įvykius per Google Calendar API.
          </p>
        </div>

        {/* Žingsnis 1 */}
        <section className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
              1
            </div>
            <div>
              <h2 className="text-xl font-bold">Google Cloud Konsolės Paruošimas</h2>
              <p className="text-stone-500 text-sm mt-1">Sukurkite projektą ir įjunkite reikiamas API</p>
            </div>
          </div>
          
          <div className="space-y-4 text-stone-700 ml-4 border-l-2 border-stone-100 pl-8">
            <p className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-stone-400 mt-0.5 flex-shrink-0" />
              Eikite į <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a>.
            </p>
            <p className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-stone-400 mt-0.5 flex-shrink-0" />
              Sukurkite naują projektą (Pvz: "Booking SaaS").
            </p>
            <p className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-stone-400 mt-0.5 flex-shrink-0" />
              Šoniniame meniu pasirinkite <strong>APIs & Services {'>'} Library</strong>.
            </p>
            <p className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-stone-400 mt-0.5 flex-shrink-0" />
              Paieškoje raskite ir įjunkite (Enable) šias dvi API: <br/>
              <span className="bg-stone-100 text-stone-800 px-2 py-1 rounded font-mono text-sm inline-block mt-2 mb-1">Gmail API</span><br/>
              <span className="bg-stone-100 text-stone-800 px-2 py-1 rounded font-mono text-sm inline-block">Google Calendar API</span>
            </p>
          </div>
        </section>

        {/* Žingsnis 2 */}
        <section className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
              2
            </div>
            <div>
              <h2 className="text-xl font-bold">Autentifikacija (OAuth 2.0 Credentials)</h2>
              <p className="text-stone-500 text-sm mt-1">Sukurkite raktus savo backend sistemai</p>
            </div>
          </div>
          
          <div className="space-y-4 text-stone-700 ml-4 border-l-2 border-stone-100 pl-8">
            <p className="flex items-start gap-2">
              <ShieldCheck className="w-5 h-5 text-stone-400 mt-0.5 flex-shrink-0" />
              Eikite į <strong>APIs & Services {'>'} Credentials</strong>.
            </p>
            <p className="flex items-start gap-2">
              <Key className="w-5 h-5 text-stone-400 mt-0.5 flex-shrink-0" />
              Spauskite <strong>Create Credentials {'>'} OAuth client ID</strong>.
              <br/>(Jei prašys, pirmiausia sukonfigūruokite "OAuth consent screen").
            </p>
            <p className="flex items-start gap-2">
              <Settings className="w-5 h-5 text-stone-400 mt-0.5 flex-shrink-0" />
              Pasirinkite Application type: <strong>Web application</strong>.
            </p>
            <p className="flex items-start gap-2">
              <Server className="w-5 h-5 text-stone-400 mt-0.5 flex-shrink-0" />
              Pridėkite Authorized redirect URIs (pvz., jūsų backend adresą <code>https://api.jusu-domenas.lt/oauth2callback</code> arba <code>https://developers.google.com/oauthplayground</code> testavimui).
            </p>
            <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl mt-4">
              <p className="font-medium mb-2">Išsaugokite šiuos duomenis (.env faile backend sistemoje):</p>
              <ul className="list-disc list-inside space-y-1 text-sm font-mono text-stone-600">
                <li>GOOGLE_CLIENT_ID</li>
                <li>GOOGLE_CLIENT_SECRET</li>
                <li>GOOGLE_REFRESH_TOKEN (gaunamas po prisijungimo)</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Žingsnis 3 - Gmail */}
          <section className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="w-8 h-8 text-rose-500" />
              <h2 className="text-xl font-bold">Gmail API (Nodemailer)</h2>
            </div>
            <p className="text-stone-500 text-sm mb-4">
              SaaS sistemoje laiškai klientams siunčiami iš backend serverio. Populiariausias būdas Node.js aplinkoje – <code>nodemailer</code>.
            </p>
            <div className="bg-stone-900 text-stone-300 p-4 rounded-xl text-xs font-mono overflow-x-auto">
              <pre>{`npm install nodemailer googleapis

// Backend kodas:
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) reject("Failed to create access token");
      resolve(token);
    });
  });

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      accessToken,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN
    }
  });
};`}</pre>
            </div>
          </section>

          {/* Žingsnis 4 - Calendar */}
          <section className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-8 h-8 text-blue-500" />
              <h2 className="text-xl font-bold">Google Calendar API</h2>
            </div>
            <p className="text-stone-500 text-sm mb-4">
              Norint automatiškai pridėti vizitą į salono kalendorių iš backend pusės, naudojamas <code>googleapis</code> paketas.
            </p>
            <div className="bg-stone-900 text-stone-300 p-4 rounded-xl text-xs font-mono overflow-x-auto">
              <pre>{`npm install googleapis

// Backend kodas:
const { google } = require('googleapis');

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

const event = {
  summary: 'Naujas Vizitas: Plaukų Dažymas',
  description: 'Klientas: Vardenis Pavardenis\\nTel: +37060000000',
  start: {
    dateTime: '2023-11-20T10:00:00+02:00',
    timeZone: 'Europe/Vilnius',
  },
  end: {
    dateTime: '2023-11-20T11:00:00+02:00',
    timeZone: 'Europe/Vilnius',
  },
};

calendar.events.insert({
  calendarId: 'primary',
  resource: event,
}, (err, event) => {
  if (err) return console.log('Klaida:', err);
  console.log('Įvykis sukurtas: %s', event.data.htmlLink);
});`}</pre>
            </div>
          </section>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-2xl text-yellow-800 text-sm">
          <p className="font-semibold mb-2">💡 Svarbi informacija gamybinei (Production) aplinkai:</p>
          <p>
            SaaS sistemoje su daug salonų (Multi-tenant), kiekvienas salonas turės prisijungti su savo Google paskyra per jūsų platformą (OAuth Consent). 
            Jūsų duomenų bazė (pvz., Supabase) turės išsaugoti kiekvieno salono asmeninį <code>refresh_token</code>, kad galėtumėte kurti įvykius jų vardu be pakartotinio prisijungimo.
          </p>
        </div>

      </main>
    </div>
  );
}
