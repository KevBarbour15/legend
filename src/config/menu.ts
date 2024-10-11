/**
 * @file This file contains the configuration for the menu.
 * All constants are used in the menu page. Adjust as needed.
 */

/**
 * The categories that are currently in use.
 * These should be updated if the categories in the Square API change.
 * These are used to compare the current categories to the categories
 * in the Square API.
 */
export const CURRENT_CATEGORIES: string[] = [
  "Lagers, Pilsners, Kolsch",
  "IPAs",
  "Seltzers and Ciders",
  "Sours and Stouts",
  "Canned / Bottled",
  "Draft",
  "Wine",
  "Non Alcoholic",
];

/**
 * Categories that should be excluded from the parent menu
 * but still displayed in the child menu "Canned / Bottled".
 */
export const EXCLUDED_CATEGORIES: string[] = [
  "Lagers, Pilsners, Kolsch",
  "IPAs",
  "Seltzers and Ciders",
  "Sours and Stouts",
];

/**
 * The order in which the categories should be displayed.
 */
export const ORDERED_CATEGORIES: string[] = [
  "Draft",
  "Canned / Bottled",
  "Wine",
  "Non Alcoholic",
];

export const CANNED_BOTTLED_BEER_ID: string = "RTQX7QKR7THOLQWVJABI5DVF";

export const BAR_INVENTORY_LOCATION_ID: string = "L3Y8KW155RG0B";

export const FALLBACK_MENU_PATH: string = "data/fallbackMenu.json";
