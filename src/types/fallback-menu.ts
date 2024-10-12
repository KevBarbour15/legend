import { MenuStructure } from "@/types/menu";
export interface SaveFallbackMenuResponse {
  success: boolean;
  error?: string;
}

export interface GetFallbackMenuResponse {
  success: boolean;
  error?: string;
  menu?: MenuStructure;
}
