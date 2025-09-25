# Money QR - Personal Expense Tracker

A modern, multilingual React Native expense tracking application with QR code receipt scanning capabilities and comprehensive financial analytics.

## 📱 Features

### 💰 Core Functionality
- **Expense Tracking**: Track daily expenses across customizable categories
- **Income Management**: Add income to your balance with transaction history
- **Multi-Currency Support**: Support for USD, EUR, GBP, RSD, and more with real-time exchange rates
- **Monthly Overview**: View income, expenses, and balance for each month
- **Transaction History**: Complete history of all income and expense transactions with revert capability

### 📊 Analytics & Insights
- **Financial Analytics**: Comprehensive analytics dashboard with spending trends
- **Category Analysis**: Track spending patterns across different expense categories
- **Monthly Comparisons**: Compare financial performance across different months
- **Visual Charts**: Interactive charts and graphs for better financial insights

### 📸 QR Receipt Scanning
- **Smart Receipt Scanning**: Scan QR codes from receipts to automatically extract amounts
- **Web Integration**: Extract total amounts from receipt web pages using WebView
- **Automatic Categorization**: Quickly assign scanned receipts to expense categories
- **Currency Conversion**: Automatic currency conversion for international receipts

### 🎨 User Experience
- **Modern UI**: Clean, intuitive interface built with NativeWind (Tailwind CSS)
- **Multilingual Support**: Available in English, Serbian, Spanish, French, and more
- **Customizable Categories**: Create, edit, and delete expense categories with custom icons
- **Edit Mode**: Easy category management with intuitive edit interface
- **Responsive Design**: Optimized for both iOS and Android devices

### ⚙️ Settings & Customization
- **Currency Selection**: Choose from multiple supported currencies
- **Language Selection**: Switch between available languages
- **Exchange Rate Status**: Real-time exchange rate updates and status monitoring
- **Data Management**: Reset app data with confirmation prompts
- **Category Management**: Hide, modify, or delete expense categories

## 🛠 Technologies Used

### Core Framework
- **React Native 0.81.4** - Cross-platform mobile development
- **Expo SDK ~54.0.10** - Development platform and tools
- **TypeScript ~5.9.2** - Type-safe JavaScript development

### UI & Styling
- **NativeWind ^4.2.1** - Tailwind CSS for React Native
- **@expo/vector-icons ^15.0.2** - Icon library (Ionicons, MaterialIcons, FontAwesome5)
- **React Native Reanimated ~4.1.0** - Advanced animations
- **React Native Safe Area Context ~5.6.0** - Safe area handling

### Data & Storage
- **@react-native-async-storage/async-storage ^2.2.0** - Local data persistence
- **Axios ^1.12.2** - HTTP client for API requests

### Camera & Scanning
- **expo-camera ^17.0.8** - Camera functionality
- **expo-barcode-scanner ^13.0.1** - QR code scanning
- **react-native-webview 13.15.0** - Web content rendering

### Internationalization
- **Custom Translation System** - Multi-language support with context-based translations
- **Translation Context** - React Context for language management

### Financial Services
- **@tamtamchik/exchanger ^3.0.0** - Currency exchange rate API
- **Custom Currency Service** - Real-time exchange rate updates and conversion
- **Exchange Rate Caching** - Optimized API calls with 1-hour cache duration

### Development Tools
- **Babel Preset Expo ^54.0.2** - JavaScript compilation
- **Prettier Plugin TailwindCSS ^0.5.14** - Code formatting
- **React Native Worklets** - Performance optimization

## 📁 Project Structure

```
money-qr/
├── components/           # React components
│   ├── HomeScreen.tsx    # Main expense tracking screen
│   ├── AnalyticsScreen.tsx # Financial analytics dashboard
│   ├── HistoryScreen.tsx # Transaction history
│   ├── SettingsScreen.tsx # App settings
│   ├── QRScannerModal.tsx # QR code scanning
│   ├── ExpenseModal.tsx  # Expense entry modal
│   └── ...              # Other UI components
├── contexts/            # React contexts
│   └── TranslationContext.tsx # Multi-language support
├── constants/           # App constants
│   ├── currencies.ts    # Currency definitions
│   ├── expenseCategories.ts # Default categories
│   └── categoryIcons.ts # Icon mappings
├── utils/              # Utility functions
│   ├── dataManager.ts   # Data persistence and management
│   ├── currencyService.ts # Currency conversion
│   ├── analyticsUtils.ts # Financial calculations
│   └── translationUtils.ts # Language utilities
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared types
└── assets/             # Static assets
    ├── icon.png        # App icon
    ├── splash-icon.png # Splash screen
    └── ...
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/money-qr.git
   cd money-qr
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   ```bash
   # For iOS
   npm run ios
   
   # For Android
   npm run android
   
   # For web
   npm run web
   ```

## 📱 Usage

### Adding Expenses
1. Tap on any expense category to add a new expense
2. Enter the amount and confirm
3. The expense is automatically added to your monthly total

### Scanning Receipts
1. Tap the "Scan Receipt QR" button on the home screen
2. Allow camera permissions when prompted
3. Point your camera at the QR code on the receipt
4. The app will extract the amount and let you assign it to a category

### Managing Categories
1. Tap the edit icon (pencil) in the spending categories section
2. Tap on any category to edit its name, icon, or color
3. Use the "+" button to add custom categories
4. Long press categories to delete them

### Viewing Analytics
1. Navigate to the Analytics tab
2. View spending trends and category breakdowns
3. Compare data across different months

### Settings
1. Go to Settings to change currency or language
2. View exchange rate status
3. Reset app data if needed

## 🌍 Supported Languages

- English
- Serbian (Српски)

## 💱 Supported Currencies

- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- RSD (Serbian Dinar)
- CAD (Canadian Dollar)
- AUD (Australian Dollar)
- JPY (Japanese Yen)
- CHF (Swiss Franc)
- And more with real-time exchange rates

## 🔧 Configuration

### Exchange Rate API
The app uses the exchangerate-api.com service for real-time currency conversion. Exchange rates are cached for 1 hour to optimize performance and reduce API calls.

### Data Storage
All data is stored locally using AsyncStorage. No data is sent to external servers except for exchange rate updates.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) for the amazing development platform
- [React Native](https://reactnative.dev/) for cross-platform mobile development
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [ExchangeRate-API](https://exchangerate-api.com/) for currency exchange rates

## 📞 Support

If you encounter any issues or have questions, please:
1. Check the [Issues](https://github.com/PetarRadojicic/money-qr/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

---

Made using React Native and Expo
