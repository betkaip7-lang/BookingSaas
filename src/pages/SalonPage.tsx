import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Salon, 
  Service, 
  Booking,
  convertSalonFromDb, 
  convertBookingFromDb 
} from "../types";
import { 
  getSalonBySlug, 
  getServicesBySalonId, 
  getBookingsBySalonId, 
  createBooking,
  checkConnection,
  DatabaseSalon,
  DatabaseService,
  DatabaseBooking
} from "../lib/supabase";
import { 
  sendBookingConfirmationEmail, 
  isEmailConfigured 
} from "../lib/email";
import { Calendar as CalendarIcon, Clock, ArrowLeft, CheckCircle2, ChevronRight, MapPin, Scissors, Info, CalendarPlus, MailCheck, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { format, addDays, startOfToday } from "date-fns";
import { lt } from "date-fns/locale";

type Step = 'service' | 'datetime' | 'details' | 'confirmation';

export function SalonPage() {
  const { salonSlug } = useParams<{ salonSlug: string }>();
  const [salon, setSalon] = useState<Salon | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Lokali būsena rezervacijoms
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  // UI būsenos
  const [step, setStep] = useState<Step>('service');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Apskaičiuoti pabaigos laiką
  const calculateEndTime = (startTime: string, durationMinutes: number): string => {
    const [h, m] = startTime.split(':').map(Number);
    const totalMinutes = h * 60 + m + durationMinutes;
    const endH = Math.floor(totalMinutes / 60);
    const endM = totalMinutes % 60;
    return `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
  };

  // Generuoti Google Calendar nuorodą
  const generateGoogleCalendarLink = () => {
    if (!salon || !selectedService || !selectedDate || !selectedTime) return '#';
    
    const start = new Date(`${selectedDate}T${selectedTime}`);
    const end = new Date(start.getTime() + selectedService.duration * 60000);

    const formatForGCal = (d: Date) => {
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
    };

    const title = encodeURIComponent(`${selectedService.name} - ${salon.name}`);
    const details = encodeURIComponent(`Jūsų vizitas salonui ${salon.name}.\nPaslauga: ${selectedService.name}\n\nAtšaukti arba keisti vizitą galite susisiekę su salonu.`);
    const dates = `${formatForGCal(start)}/${formatForGCal(end)}`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}`;
  };

  // Gauti laisvus laikus
  const getAvailableTimes = (dateStr: string) => {
    if (!selectedService || !salon) return [];
    
    const times: string[] = [];
    const [openH, openM] = salon.workingHours.open.split(':').map(Number);
    const [closeH, closeM] = salon.workingHours.close.split(':').map(Number);
    
    let currentMin = openH * 60 + openM;
    const endMin = closeH * 60 + closeM;
    const duration = selectedService.duration;

    // Gauti užimtus intervalus
    const bookedRanges = bookings
      .filter(b => b.date === dateStr)
      .map(b => {
        const [h, m] = b.time.split(':').map(Number);
        const start = h * 60 + m;
        const endTime = b.endTime;
        const end = endTime 
          ? endTime.split(':').reduce((acc, t) => acc * 60 + parseInt(t), 0)
          : start + 60;
        return { start, end };
      });

    while (currentMin + duration <= endMin) {
      const s = currentMin;
      const e = currentMin + duration;
      
      const overlap = bookedRanges.some(br => (s < br.end && e > br.start));
      
      if (!overlap) {
        const hours = Math.floor(currentMin / 60).toString().padStart(2, '0');
        const mins = (currentMin % 60).toString().padStart(2, '0');
        times.push(`${hours}:${mins}`);
      }
      currentMin += 30;
    }
    
    return times;
  };

  // Duomenų gavimas iš Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setConnectionError(null);

      try {
        // Patikrinti ryšį
        const isConnected = await checkConnection();
        if (!isConnected) {
          setConnectionError('Nepavyko prisijungti prie duomenų bazės. Patikrinkite interneto ryšį.');
          setLoading(false);
          return;
        }

        if (salonSlug) {
          const dbSalon = await getSalonBySlug(salonSlug);
          
          if (dbSalon) {
            const dbServices = await getServicesBySalonId(dbSalon.id);
            const dbBookings = await getBookingsBySalonId(dbSalon.id);
            
            const convertedSalon = convertSalonFromDb(dbSalon as DatabaseSalon, dbServices as DatabaseService[]);
            setSalon(convertedSalon);
            setBookings(dbBookings.map((b: DatabaseBooking) => convertBookingFromDb(b)));
          } else {
            setSalon(null);
          }
        }
      } catch (error) {
        console.error('Klaida gaunant duomenis:', error);
        setConnectionError('Įvyko klaida gaunant duomenis.');
      }
      
      setLoading(false);
    };

    fetchData();
  }, [salonSlug]);

  // Rezervacijos pateikimas
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedTime || !salon) return;
    
    setIsBooking(true);
    setBookingError(null);

    const bookingData = {
      salon_id: salon.id,
      service_id: selectedService.id,
      date: selectedDate,
      time: selectedTime,
      end_time: calculateEndTime(selectedTime, selectedService.duration),
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone
    };

    try {
      const result = await createBooking(bookingData);
      
      if (!result.success) {
        throw new Error(result.error || 'Nepavyko sukurti rezervacijos');
      }
      
      // Pridėti naują rezervaciją prie vietinės būsenos
      if (result.data) {
        const newBooking: Booking = {
          id: result.data.id,
          salonId: salon.id,
          serviceId: selectedService.id,
          date: selectedDate,
          time: selectedTime,
          endTime: bookingData.end_time,
          userName: formData.name,
          userPhone: formData.phone,
          userEmail: formData.email,
          status: 'confirmed'
        };
        setBookings(prev => [...prev, newBooking]);
      }

      // Siųsti patvirtinimo el. laišką
      const emailData = {
        to_email: formData.email,
        to_name: formData.name,
        salon_name: salon.name,
        service_name: selectedService.name,
        booking_date: selectedDate,
        booking_time: selectedTime,
        duration: selectedService.duration,
        price: selectedService.price,
        salon_address: salon.address || '',
        salon_phone: salon.phone || ''
      };
      
      await sendBookingConfirmationEmail(emailData);
      
      setStep('confirmation');
    } catch (error) {
      console.error('Rezervacijos klaida:', error);
      setBookingError(error instanceof Error ? error.message : 'Įvyko klaida kuriant rezervaciją. Bandykite dar kartą.');
    } finally {
      setIsBooking(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-stone-200 border-t-stone-800 rounded-full animate-spin"></div>
          <p className="text-stone-500 font-medium">Kraunama informacija...</p>
        </div>
      </div>
    );
  }

  // Connection error
  if (connectionError) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex flex-col items-center justify-center gap-4 text-center px-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-semibold text-stone-900">Ryšio klaida</h1>
        <p className="text-stone-500 max-w-sm">{connectionError}</p>
        <Link to="/" className="mt-4 px-6 py-2 bg-stone-900 text-white rounded-full text-sm font-medium hover:bg-stone-800 transition">
          Grįžti į pagrindinį
        </Link>
      </div>
    );
  }

  // Salonas nerastas
  if (!salon) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex flex-col items-center justify-center gap-4 text-center px-6">
        <h1 className="text-2xl font-semibold text-stone-900">Salonas nerastas</h1>
        <p className="text-stone-500 max-w-sm">Atsiprašome, tačiau salonas su šiuo adresu neegzistuoja.</p>
        <Link to="/" className="mt-4 px-6 py-2 bg-stone-900 text-white rounded-full text-sm font-medium hover:bg-stone-800 transition">
          Grįžti į pagrindinį
        </Link>
      </div>
    );
  }

  // Generuoti galimas datas (14 dienų)
  const today = startOfToday();
  const availableDates = Array.from({ length: 14 }).map((_, i) => addDays(today, i));
  const times = selectedDate ? getAvailableTimes(selectedDate) : [];

  return (
    <div className="min-h-screen bg-[#fafaf9] text-stone-900 font-sans pb-24">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          {step !== 'service' && step !== 'confirmation' ? (
            <button 
              onClick={() => {
                if (step === 'datetime') setStep('service');
                if (step === 'details') setStep('datetime');
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-100 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-10"></div>
          )}
          
          <div className="flex-1 text-center font-medium">
            {step === 'service' && "Pasirinkite paslaugą"}
            {step === 'datetime' && "Pasirinkite laiką"}
            {step === 'details' && "Jūsų informacija"}
            {step === 'confirmation' && "Rezervacija patvirtinta"}
          </div>
          
          <div className="w-10 flex items-center justify-center">
            {step === 'service' && (
              <div className="flex items-center gap-1 text-green-600" title="Prisijungta prie duomenų bazės">
                <CheckCircle className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {step === 'service' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Salon Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <img src={salon.logo} alt={salon.name} className="w-24 h-24 rounded-full object-cover shadow-sm" />
              <div>
                <h1 className="text-2xl font-semibold mb-2">{salon.name}</h1>
                <p className="text-stone-500 text-sm leading-relaxed mb-4 max-w-md">{salon.description}</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-medium text-stone-600">
                  {salon.address && (
                    <span className="flex items-center gap-1 bg-stone-100 px-3 py-1.5 rounded-full">
                      <MapPin className="w-3 h-3" /> {salon.address}
                    </span>
                  )}
                  <span className="flex items-center gap-1 bg-stone-100 px-3 py-1.5 rounded-full">
                    <Clock className="w-3 h-3" /> {salon.workingHours.open} - {salon.workingHours.close}
                  </span>
                </div>
              </div>
            </div>

            {/* Services List */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500 ml-1">Paslaugos</h2>
              {salon.services.length > 0 ? (
                salon.services.map(service => (
                  <button
                    key={service.id}
                    onClick={() => {
                      setSelectedService(service);
                      setStep('datetime');
                    }}
                    className="w-full bg-white border border-stone-200 p-4 rounded-xl flex items-center justify-between hover:border-stone-400 hover:shadow-md transition-all group text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-500 group-hover:bg-stone-900 group-hover:text-white transition-colors">
                        <Scissors className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-stone-500 mt-0.5">{service.duration} min.</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="font-semibold">{service.price}€</div>
                      <ChevronRight className="w-5 h-5 text-stone-300 group-hover:text-stone-900 transition-colors" />
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center p-8 bg-stone-100 rounded-xl text-stone-500">
                  Šiuo metu paslaugų nėra.
                </div>
              )}
            </div>
          </div>
        )}

        {step === 'datetime' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Selected Service Snippet */}
            <div className="bg-white border border-stone-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-sm text-stone-500 mb-1">Pasirinkta paslauga</div>
                <div className="font-medium">{selectedService?.name}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">{selectedService?.price}€</div>
                <div className="text-sm text-stone-500">{selectedService?.duration} min.</div>
              </div>
            </div>

            {/* Dates */}
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500 ml-1 mb-3 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" /> Pasirinkite dieną
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-4 snap-x" style={{ scrollbarWidth: 'none' }}>
                {availableDates.map((date, idx) => {
                  const dateStr = format(date, 'yyyy-MM-dd');
                  const isSelected = selectedDate === dateStr;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedDate(dateStr);
                        setSelectedTime(null);
                      }}
                      className={`flex-shrink-0 snap-center w-20 py-3 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                        isSelected 
                          ? 'bg-stone-900 border-stone-900 text-white shadow-md' 
                          : 'bg-white border-stone-200 text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      <span className="text-xs font-medium uppercase mb-1 opacity-80">{format(date, 'EEE', { locale: lt })}</span>
                      <span className="text-xl font-bold">{format(date, 'd')}</span>
                      <span className="text-xs opacity-80 mt-1">{format(date, 'MMM', { locale: lt })}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Times */}
            {selectedDate && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500 ml-1 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Laisvi laikai
                </h2>
                {times.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {times.map((time, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 rounded-xl text-sm font-medium border transition-all ${
                          selectedTime === time
                            ? 'bg-stone-900 border-stone-900 text-white shadow-md'
                            : 'bg-white border-stone-200 text-stone-700 hover:border-stone-400'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 bg-stone-100 rounded-xl text-stone-500 text-sm">
                    Šią dieną laisvų laikų nėra. Pasirinkite kitą dieną.
                  </div>
                )}
              </div>
            )}

            {selectedTime && (
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-stone-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50 animate-in slide-in-from-bottom-full">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                  <div>
                    <div className="text-sm text-stone-500">Pasirinktas laikas</div>
                    <div className="font-semibold">{format(new Date(selectedDate!), 'MMM d, EEE', { locale: lt })} • {selectedTime}</div>
                  </div>
                  <button
                    onClick={() => setStep('details')}
                    className="px-8 py-3 bg-stone-900 text-white rounded-full font-medium hover:bg-stone-800 transition shadow-lg"
                  >
                    Tęsti
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 'details' && (
          <form onSubmit={handleBookingSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Summary */}
            <div className="bg-stone-100 rounded-2xl p-6 mb-8 text-sm space-y-3">
              <h3 className="font-semibold text-lg mb-4">Užsakymo informacija</h3>
              <div className="flex justify-between">
                <span className="text-stone-500">Paslauga</span>
                <span className="font-medium">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Data ir laikas</span>
                <span className="font-medium">{selectedDate} @ {selectedTime}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-stone-200">
                <span className="text-stone-500">Kaina</span>
                <span className="font-semibold text-base">{selectedService?.price}€</span>
              </div>
            </div>

            {/* Error message */}
            {bookingError && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-700 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                {bookingError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1 ml-1">Vardas ir pavardė *</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition"
                  placeholder="Vardenis Pavardenis"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1 ml-1">Telefono numeris *</label>
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition"
                  placeholder="+370 600 00000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1 ml-1">El. paštas *</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition"
                  placeholder="vardas@pavyzdys.lt"
                />
              </div>
            </div>
            
            <div className="pt-6">
              <button
                type="submit"
                disabled={isBooking}
                className="w-full py-4 bg-stone-900 text-white rounded-xl font-medium text-lg hover:bg-stone-800 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isBooking ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Patvirtinama...
                  </>
                ) : (
                  "Patvirtinti rezervaciją"
                )}
              </button>
            </div>
            <p className="text-xs text-center text-stone-500 mt-4 flex items-center justify-center gap-1">
              <Info className="w-3 h-3" /> Apmokėjimas vietoje po procedūros.
            </p>
          </form>
        )}

        {step === 'confirmation' && (
          <div className="py-12 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-stone-900 mb-2">Sėkmingai rezervuota!</h1>
            <p className="text-stone-500 max-w-sm mb-6 leading-relaxed">
              Ačiū, {formData.name.split(' ')[0]}! Jūsų vizitas patvirtintas ir lauksime jūsų {selectedDate} d., {selectedTime} val.
            </p>

            {/* Email verification notice */}
            <div className="flex items-start sm:items-center gap-3 bg-blue-50/50 text-blue-800 border border-blue-100 px-5 py-4 rounded-xl mb-8 text-sm max-w-sm w-full text-left shadow-sm">
              <MailCheck className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5 sm:mt-0" />
              <div className="leading-relaxed">
                <p>Patvirtinimo laiškas su vizito informacija išsiųstas adresu <span className="font-semibold">{formData.email}</span></p>
                {!isEmailConfigured() && (
                  <p className="text-xs text-stone-500 mt-1">(EmailJS nėra sukonfigūruotas - el. laiškas neišsiųstas tikrovėje)</p>
                )}
              </div>
            </div>
            
            <div className="bg-white border border-stone-200 rounded-2xl p-6 w-full max-w-sm text-left space-y-4 mb-6">
              <div>
                <div className="text-xs text-stone-400 uppercase tracking-wider mb-1">Salonas</div>
                <div className="font-medium flex items-center gap-2">
                  <img src={salon.logo} alt="" className="w-6 h-6 rounded-full" />
                  {salon.name}
                </div>
              </div>
              <div>
                <div className="text-xs text-stone-400 uppercase tracking-wider mb-1">Paslauga</div>
                <div className="font-medium">{selectedService?.name}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-stone-400 uppercase tracking-wider mb-1">Data</div>
                  <div className="font-medium">{selectedDate}</div>
                </div>
                <div>
                  <div className="text-xs text-stone-400 uppercase tracking-wider mb-1">Laikas</div>
                  <div className="font-medium">{selectedTime}</div>
                </div>
              </div>
              <div className="pt-2 border-t border-stone-100">
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Išsaugota duomenų bazėje
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm">
              <a 
                href={generateGoogleCalendarLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition shadow-md"
              >
                <CalendarPlus className="w-5 h-5" />
                Google Kalendorius
              </a>
              <button
                onClick={() => {
                  setStep('service');
                  setSelectedService(null);
                  setSelectedDate(null);
                  setSelectedTime(null);
                  setFormData({ name: '', phone: '', email: '' });
                  setBookingError(null);
                }}
                className="w-full px-6 py-3 bg-white border border-stone-200 text-stone-900 rounded-xl font-medium hover:bg-stone-50 transition shadow-sm"
              >
                Nauja rezervacija
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
