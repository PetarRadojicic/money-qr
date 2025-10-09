import type { ComponentProps } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { TranslationKey } from "../i18n/translations";

export type CategoryKey =
  | "categoryEssentials"
  | "categoryFood"
  | "categoryTransport"
  | "categoryEntertainment"
  | "categorySavings";

export type CategoryConfig = {
  key: CategoryKey;
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  color: string;
};

export const CATEGORY_CONFIG: CategoryConfig[] = [
  {
    key: "categoryEssentials",
    icon: "shield-check",
    color: "#38bdf8",
  },
  {
    key: "categoryFood",
    icon: "silverware-fork-knife",
    color: "#f97316",
  },
  {
    key: "categoryTransport",
    icon: "transit-connection-variant",
    color: "#22c55e",
  },
  {
    key: "categoryEntertainment",
    icon: "controller-classic",
    color: "#a855f7",
  },
  {
    key: "categorySavings",
    icon: "piggy-bank",
    color: "#facc15",
  },
];

export const CATEGORY_KEYS: CategoryKey[] = CATEGORY_CONFIG.map(({ key }) => key);

export const isCategoryKey = (key: TranslationKey): key is CategoryKey =>
  CATEGORY_KEYS.includes(key as CategoryKey);

