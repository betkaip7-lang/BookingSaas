import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export interface BookingEmailData {
  to_email: string;
  to_name: string;
  salon_name: string;
  service_name: string;
  booking_date: string;
  booking_time: string;
  duration: number;
  price: number;
  salon_address: string;
  salon_phone: string;
}

export const sendBookingConfirmationEmail = async (data: BookingEmailData): Promise<boolean> => {
  // Check if EmailJS is configured
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    console.warn('EmailJS not configured. Email will not be sent.');
    console.log('Booking confirmation data:', data);
    return false;
  }

  try {
    const templateParams = {
      to_email: data.to_email,
      to_name: data.to_name,
      salon_name: data.salon_name,
      service_name: data.service_name,
      booking_date: data.booking_date,
      booking_time: data.booking_time,
      duration: data.duration,
      price: data.price,
      salon_address: data.salon_address,
      salon_phone: data.salon_phone,
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('Email sent successfully:', response.status, response.text);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

export const isEmailConfigured = (): boolean => {
  return !!(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY);
};
