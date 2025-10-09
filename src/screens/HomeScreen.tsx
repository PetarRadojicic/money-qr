import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BalanceSummary from "../components/HomeScreen/BalanceSummary";
import MonthSelector from "../components/HomeScreen/MonthSelector";
import CategoriesGrid from "../components/HomeScreen/CategoriesGrid";
import QuickActions from "../components/HomeScreen/QuickActions";

const HomeScreen = () => {
  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-slate-50 dark:bg-slate-950">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <BalanceSummary />

        <MonthSelector />

        <CategoriesGrid />

        <QuickActions onScanQr={() => null} onAddToBalance={() => null} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

