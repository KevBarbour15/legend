export interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  howDidYouHear: string;
  preferredDate: Date | null;
  message: string;
  error: string;
}
