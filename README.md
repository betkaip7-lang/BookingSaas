# Booking SaaS – Grožio salonų rezervacijų sistema

Moderni, multi-tenant rezervacijų sistema grožio salonams, sukurta naudojant **React + Vite + Tailwind CSS** ir **Supabase** kaip duomenų bazę.

Viskas pateikiama lietuvių kalba.

---

## 1. Projekto paleidimas lokaliai

```bash
npm install
npm run dev
```

Aplikacija bus pasiekiama adresu (numatytasis):

- http://localhost:5173

Demo salonas:

- http://localhost:5173/#/NaujasSalonas

---

## 2. Supabase duomenų bazės sukūrimas

1. Prisijunkite prie [Supabase](https://supabase.com) ir sukurkite naują projektą.
2. Atidarykite **SQL Editor**.
3. Nukopijuokite visą `supabase-schema.sql` failo turinį iš šio repo ir įklijuokite į naują SQL užklausą.
4. Paspauskite **Run**.

Tai sukurs lenteles:

- `salons`
- `services`
- `bookings`

Taip pat įterps demo duomenis **NaujasSalonas** salonui.

### 2.1. Supabase API raktai

Supabase projekte eikite į **Project Settings → API** ir nukopijuokite:

- **Project URL** – pvz. `https://mfnkhsxgfjlljwlotkvi.supabase.co`
- **anon public key** – ilgas raktas, prasidedantis `eyJ...`

Lokaliai sukurkite `.env.local` failą projekto šaknyje (šalia `package.json`):

```env
VITE_SUPABASE_URL=https://mfnkhsxgfjlljwlotkvi.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Tada paleiskite projektą iš naujo:

```bash
npm run dev
```

---

## 3. El. laiško siuntimas po rezervacijos (backend pavyzdys)

Frontend (ši Vite aplikacija) pateikia rezervacijos duomenis į **Supabase** ir parodo, kad patvirtinimo laiškas išsiųstas. Kad realiai išsiųstumėte el. laišką, reikia mažo **Node.js backend** su `nodemailer` ir Gmail.

### 3.1. Backend projekto kūrimas

Sukurkite naują aplanką, pvz. `booking-email-service`:

```bash
mkdir booking-email-service
cd booking-email-service
npm init -y
npm install express cors nodemailer googleapis dotenv
```

Sukurkite `server.js`:

```js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const app = express();
app.use(cors());
app.use(express.json());

const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

async function createTransporter() {
  const accessToken = await oauth2Client.getAccessToken();

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL_FROM, // <== ČIA ĮRAŠYKITE SAVO SIUNTĖJO EL. PAŠTĄ
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  });
}

app.post('/send-booking-email', async (req, res) => {
  const {
    customerEmail,
    customerName,
    salonName,
    serviceName,
    date,
    time,
  } = req.body;

  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: `${salonName} <${process.env.EMAIL_FROM}>`,
      to: customerEmail,
      subject: `Jūsų vizito patvirtinimas – ${salonName}`,
      text: `Sveiki, ${customerName},\n\nJūsų vizitas sėkmingai užregistruotas.\n\nSalonas: ${salonName}\nPaslauga: ${serviceName}\nData: ${date}\nLaikas: ${time}\n\nJeigu norėtumėte pakeisti ar atšaukti vizitą, susisiekite su mumis.`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (err) {
    console.error('Klaida siunčiant el. laišką:', err);
    res.status(500).json({ success: false, error: 'Nepavyko išsiųsti el. laiško' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Email serveris paleistas ant porto ${PORT}`);
});
```

### 3.2. Kur įrašyti savo el. paštą

Sukurkite `.env` tame pačiame backend aplanke:

```env
EMAIL_FROM=littlenestprintables.inc@gmail.com
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REFRESH_TOKEN=...
```

- `EMAIL_FROM` – tai siuntėjo adresas (šiuo metu maketas: `littlenestprintables.inc@gmail.com`).

Tada paleiskite backend:

```bash
node server.js
```

### 3.3. Frontend sujungimas su backend

Po sėkmingos rezervacijos sukūrimo Supabase (vietoje, kur vedate vartotoją į patvirtinimo žingsnį), iškvieskite:

```ts
await fetch('http://localhost:4000/send-booking-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customerEmail: formData.email,
    customerName: formData.name,
    salonName: salon.name,
    serviceName: selectedService.name,
    date: selectedDate,
    time: selectedTime,
  }),
}).catch(() => {
  console.warn('Nepavyko išsiųsti el. laiško, tačiau rezervacija sukurta.');
});
```

Frontend jau rodo pranešimą, kad patvirtinimo laiškas išsiųstas – šis backend užtikrina realų išsiuntimą.

---

## 4. GitHub Pages hostingas

Projektas naudoja `HashRouter`, todėl idealiai tinka GitHub Pages.

### 4.1. Vite konfigūracija

`vite.config.ts` faile jau yra:

```ts
export default defineConfig({
  base: './',
  // ...
});
```

- Tai leidžia projektą talpinti tiek repo šaknyje, tiek GitHub Pages.

### 4.2. Git repo ir GitHub

```bash
git init
git add .
git commit -m "Pradinis commitas"
```

GitHub:

1. Sukurkite naują repo (pvz. `booking-saas`).
2. Prijunkite remote ir išsiųskite:

```bash
git branch -M main
git remote add origin https://github.com/<jusu-vartotojas>/booking-saas.git
git push -u origin main
```

### 4.3. GitHub Pages Actions workflow

Repo jau turi `.github/workflows/deploy.yml`, kuris:

- Ant `push` į `main` paleidžia:
  - `npm ci || npm install`
  - `npm run build`
  - įkelia `dist` į GitHub Pages.

Github UI:

1. Eikite į **Settings → Pages**.
2. „Build and deployment“ pasirinkite **GitHub Actions**.
3. Po pirmo sėkmingo workflow, čia pamatysite nuorodą į savo svetainę, pvz.:

```text
https://<jusu-vartotojas>.github.io/booking-saas/
```

Aplikacijos maršrutai veiks per hash: `#/NaujasSalonas`.

---

## 5. Maršrutai

- `/` – SaaS pagrindinis (landing) puslapis.
- `#/NaujasSalonas` – demo salono rezervacijų puslapis.

Supabase naudojama kaip vienintelis duomenų šaltinis (mock failas pašalintas).