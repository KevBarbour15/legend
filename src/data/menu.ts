export interface MenuItem {
  id: string;
  name: string | undefined;
  brand: string | undefined;
  description: string | undefined;
  price: string | undefined;
  abv: string | undefined;
  city: string | undefined;
}

export interface MenuProps {
  initialData: MenuStructure | null;
  error?: string;
  initialTimestamp?: string;
}

export interface CategoryWithItems {
  id: string;
  name?: string | null;
  items: ProcessedItem[];
  childCategories: CategoryWithItems[];
}

export interface MenuStructure {
  [categoryName: string]: ProcessedItem[] | CategoryWithItems;
}

export interface ProcessedItem {
  id: string;
  name?: string | null;
  brand?: string | null;
  description?: string | null;
  price?: string | null;
  bottlePrice?: string | null;
  varieties?: string | null;
  city?: string | null;
  abv?: string | null;
  categoryIds: string[];
  locationIds: string[];
  inStock: boolean;
}
