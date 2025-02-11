import { MenuStructure } from "@/data/menu";
export interface SaveMenuResponse {
  success: boolean;
  error?: string;
}

export interface GetMenuResponse {
  success: boolean;
  error?: string;
  menu?: MenuStructure;
}
