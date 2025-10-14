import type { ComponentProps } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { TranslationKey } from "../i18n/translations";

export type CategoryKey =
  | "categoryGroceries"
  | "categoryBills"
  | "categoryTransport"
  | "categoryShopping"
  | "categoryDiningOut";

export type CategoryConfig = {
  key: CategoryKey;
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  color: string;
};

export const CATEGORY_CONFIG: CategoryConfig[] = [
  {
    key: "categoryGroceries",
    icon: "cart",
    color: "#22c55e",
  },
  {
    key: "categoryBills",
    icon: "receipt",
    color: "#ef4444",
  },
  {
    key: "categoryTransport",
    icon: "car",
    color: "#3b82f6",
  },
  {
    key: "categoryShopping",
    icon: "shopping",
    color: "#a855f7",
  },
  {
    key: "categoryDiningOut",
    icon: "silverware-fork-knife",
    color: "#f97316",
  },
];

export const CATEGORY_KEYS: CategoryKey[] = CATEGORY_CONFIG.map(({ key }) => key);

export const isCategoryKey = (key: string): key is CategoryKey =>
  CATEGORY_KEYS.includes(key as CategoryKey);

// Helper function to check if a category name should be translated
export const shouldTranslateCategoryName = (name: string): boolean =>
  isCategoryKey(name);

