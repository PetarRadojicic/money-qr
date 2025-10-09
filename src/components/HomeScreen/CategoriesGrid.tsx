import type { ComponentProps } from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useTranslation } from "../../hooks/useTranslation";
import type { TranslationKey } from "../../i18n/translations";

type Category = {
  key: TranslationKey;
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  color: string;
  amountLabel?: string;
};

type CategoriesGridProps = {
  categories?: Category[];
};

const defaultCategories: Category[] = [
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

const CategoriesGrid = ({ categories = defaultCategories }: CategoriesGridProps) => {
  const { t } = useTranslation();

  return (
    <View className="mt-8">
      <Text className="text-base font-semibold text-slate-800 dark:text-slate-100">{t("categories")}</Text>
      <View className="mt-4 flex-row flex-wrap gap-3">
        {categories.map(({ key, icon, color, amountLabel }) => (
          <View
            key={key}
            className="w-[47%] rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
          >
            <View className="flex-row items-center gap-3">
              <View className="rounded-2xl bg-slate-100 p-3 dark:bg-slate-800">
                <MaterialCommunityIcons name={icon} size={22} color={color} />
              </View>
              <Text className="text-sm font-medium text-slate-700 dark:text-slate-100">{t(key)}</Text>
            </View>
            {amountLabel ? (
              <Text className="mt-3 text-xs text-slate-400 dark:text-slate-500">{amountLabel}</Text>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
};

export default CategoriesGrid;

