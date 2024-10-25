export interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  howDidYouHear: string;
  eventDate: Date | null;
  message: string;
  error: string;
}
