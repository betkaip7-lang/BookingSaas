import { Link } from "react-router-dom";
import { Sparkles, Calendar, Settings } from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-stone-200">
      <nav className="border-b border-stone-200 bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-semibold text-xl tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-stone-700" />
            Bookify SaaS
          </div>
          <div className="flex items-center gap-6">
            <Link
              to="/instrukcijos"
              className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors hidden sm:block"
            >
              Integracijų Gidas
            </Link>
            <Link
              to="/NaujasSalonas"
              className="text-sm font-medium text-stone-900 bg-stone-100 hover:bg-stone-200 px-4 py-2 rounded-full transition-colors"
            >
              Demo Salonas
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <section className="max-w-5xl mx-auto px-6 py-24 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-stone-900 mb-6 max-w-3xl mx-auto leading-tight">
            Paprasta ir moderni rezervacijų sistema jūsų salonui.
          </h1>
          <p className="text-lg md:text-xl text-stone-500 mb-10 max-w-2xl mx-auto">
            Automatizuokite klientų registracijas, valdykite savo kalendorių ir sutaupykite brangaus laiko naudodami mūsų SaaS platformą.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/NaujasSalonas"
              className="px-8 py-3 rounded-full bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors inline-flex items-center gap-2 shadow-lg"
            >
              Išbandyti Demo <Sparkles className="w-4 h-4" />
            </Link>
            <Link
              to="/instrukcijos"
              className="px-8 py-3 rounded-full bg-white border border-stone-200 text-stone-700 font-medium hover:bg-stone-50 transition-colors inline-flex items-center gap-2"
            >
              Integracijų Instrukcija
            </Link>
          </div>
        </section>

        <section className="bg-white py-24 border-t border-stone-100">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="space-y-4 text-center md:text-left">
                <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
                  <Calendar className="w-6 h-6 text-stone-700" />
                </div>
                <h3 className="text-xl font-semibold">24/7 Registracija</h3>
                <p className="text-stone-500">
                  Leiskite klientams registruotis bet kuriuo metu. Sistemoje automatiškai matomi tik laisvi laikai.
                </p>
              </div>
              <div className="space-y-4 text-center md:text-left">
                <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
                  <Settings className="w-6 h-6 text-stone-700" />
                </div>
                <h3 className="text-xl font-semibold">Paprastas Valdymas</h3>
                <p className="text-stone-500">
                  Lengvai pridėkite paslaugas, redaguokite darbo valandas bei prižiūrėkite atvykstančius klientus.
                </p>
              </div>
              <div className="space-y-4 text-center md:text-left">
                <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
                  <Sparkles className="w-6 h-6 text-stone-700" />
                </div>
                <h3 className="text-xl font-semibold">Modernus Dizainas</h3>
                <p className="text-stone-500">
                  Švari ir minimalistinė vartotojo sąsaja, kuri puikiai atrodo tiek kompiuteryje, tiek telefone.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
