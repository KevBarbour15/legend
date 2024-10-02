export interface Event {
  _id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  notes: string;
  image_url: string;
  is_photo: boolean;
  is_public: boolean;
}

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

export interface MenuItem {
  id: string;
  name: string | undefined;
  brand: string | undefined;
  description: string | undefined;
  price: string | undefined;
  abv: string | undefined;
  city: string | undefined;
}

export interface MenuStructure {
  [categoryName: string]: MenuItem[];
}
