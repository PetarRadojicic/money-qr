# Money QR 📱💰

A modern React Native personal finance tracking app with QR receipt scanning capabilities, built with Expo and TypeScript.

## 🌟 Features

### Core Functionality
- **📊 Financial Tracking**: Track income and expenses with precise monetary calculations using dinero.js
- **📱 AI-Powered QR Receipt Scanning**: Scan QR codes on receipts with AI-powered parsing to automatically extract and categorize expenses
- **📈 Visual Analytics**: Interactive charts showing spending patterns and financial trends
- **🏷️ Custom Categories**: Create and manage custom expense categories with icons and colors
- **📅 Monthly Organization**: View and manage finances by month with easy navigation
- **💱 Multi-Currency Support**: Support for 60+ currencies with automatic conversion
- **🌍 Internationalization**: Full support for English and Serbian languages
- **🌙 Dark/Light Themes**: Beautiful UI with system-aware theme switching

### Technical Features
- **🔒 Persistent Storage**: All data stored locally using AsyncStorage
- **⚡ Real-time Updates**: Instant UI updates with Zustand state management
- **🎨 Modern UI**: Built with NativeWind (Tailwind CSS for React Native)
- **📱 Cross-Platform**: Works on iOS, Android, and Web
- **🔧 TypeScript**: Fully typed for better development experience

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or later)
- npm (comes with Node.js)
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PetarRadojicic/money-qr.git
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

4. **Run on your preferred platform**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## 📱 App Structure

### Screens
- **🏠 Home**: Main dashboard with balance summary, categories, and quick actions
- **📊 Analytics**: Visual charts and financial insights
- **📜 History**: Transaction history and management
- **⚙️ Settings**: App preferences, currency, language, and theme settings
- **👋 Welcome**: Onboarding flow for first-time users

### Key Components

#### Home Screen Components
- `BalanceSummary`: Displays total balance, income, and expenses
- `MonthSelector`: Navigate between different months
- `CategoriesGrid`: Visual grid of expense categories
- `QuickActions`: Quick access to add income or scan QR codes
- `QRScanner`: Camera interface for scanning receipt QR codes

#### Analytics Components
- `TimePeriodSelector`: Choose analysis period (3, 6, 9 months, or all)
- `TotalsSummary`: Income vs expenses summary
- `IncomeVsExpensesChart`: Line chart showing financial trends
- `ExpensesByCategoryChart`: Pie chart of spending by category

#### Modal Components
- `AddIncomeModal`: Add income transactions
- `AddExpenseModal`: Add expense transactions
- `AddCategoryModal`: Create custom categories
- `EditCategoryModal`: Modify existing categories
- `SelectCategoryModal`: Choose category for scanned receipts
- `QRScanner`: Camera-based QR code scanning

## 🏗️ Architecture

### State Management
- **Zustand**: Lightweight state management for finance data and preferences
- **Persistent Storage**: AsyncStorage integration for data persistence
- **Type Safety**: Full TypeScript support with strict typing

### Key Stores
- `useFinanceStore`: Manages transactions, categories, and financial calculations
- `usePreferencesStore`: Handles theme, language, currency, and onboarding state

### Data Flow
1. **User Input** → **Store Actions** → **State Update** → **UI Re-render**
2. **QR Scan** → **API Call** → **Receipt Parsing** → **Category Selection** → **Transaction Creation**

## 💰 Financial Calculations

The app uses **dinero.js** for precise monetary calculations to avoid floating-point errors:

- All amounts are stored as decimal numbers
- Calculations use dinero.js for addition, subtraction, and currency conversion
- Support for 60+ currencies with real-time exchange rates from exchangerate-api.com
- Automatic currency conversion for international receipts via API service

## 🌍 Internationalization

### Supported Languages
- **English** (en): Default language
- **Serbian** (sr): Full translation support

### Translation Keys
All user-facing text uses translation keys from `src/i18n/translations.ts`:
- Screen titles and navigation
- Form labels and placeholders
- Error messages and notifications
- Category names and descriptions

## 🎨 Theming

### Theme System
- **Light Theme**: Clean, modern light interface
- **Dark Theme**: Eye-friendly dark interface
- **System Theme**: Automatically follows device theme preference

### Styling
- **NativeWind**: Tailwind CSS for React Native
- **Consistent Design**: Unified color palette and spacing
- **Responsive**: Adapts to different screen sizes

## 📱 QR Receipt Scanning

### How It Works
1. **Scan QR Code**: Use camera to scan QR codes on receipts
2. **AI Processing**: Send raw QR data to AI-powered parsing service
3. **Smart Extraction**: AI automatically extracts total amount, currency, date, and vendor information
4. **Convert Currency**: Automatically convert to user's preferred currency
5. **Select Category**: Choose appropriate expense category
6. **Create Transaction**: Add expense to financial records

### Supported Receipt Formats
- QR codes containing receipt URLs
- Encoded receipt data
- Various international receipt formats
- AI-powered parsing handles multiple languages and formats

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
API_BASE_URL=http://your-api.com
```

The API service handles both:
- **Receipt Parsing**: AI-powered extraction of receipt data from QR codes
- **Currency Exchange**: Real-time currency conversion using exchangerate-api.com

### Currency Support
The app supports 60+ currencies with real-time exchange rates powered by [exchangerate-api.com](https://exchangerate-api.com):
- Major currencies: USD, EUR, GBP, JPY, CHF, CAD, AUD
- Regional currencies: RSD, RUB, BRL, ZAR, MXN, SGD, etc.
- Full list available in `src/constants/currencies.ts`
- Automatic currency conversion for international receipts

## 📊 Analytics Features

### Time Periods
- **3 Months**: Recent quarterly analysis
- **6 Months**: Semi-annual trends
- **9 Months**: Extended period analysis
- **All Time**: Complete financial history

### Chart Types
- **Line Charts**: Income vs expenses over time
- **Pie Charts**: Spending breakdown by category
- **Summary Cards**: Key financial metrics

## 🛠️ Development

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── AnalyticsScreen/ # Analytics-specific components
│   ├── HomeScreen/      # Home screen components
│   ├── modals/         # Modal dialogs
│   └── SettingsScreen/ # Settings components
├── constants/          # App constants and configurations
├── hooks/             # Custom React hooks
├── i18n/             # Internationalization
├── navigation/       # Navigation configuration
├── screens/          # Main app screens
├── services/         # External service integrations
├── store/           # State management (Zustand stores)
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

### Key Dependencies
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **TypeScript**: Type-safe JavaScript
- **Zustand**: State management
- **NativeWind**: Tailwind CSS for React Native
- **React Navigation**: Navigation library
- **Expo Camera**: Camera functionality
- **Dinero.js**: Precise monetary calculations
- **React Native Chart Kit**: Chart components

### Development Commands
```bash
# Start development server
npm start

# Run on specific platforms
npm run ios
npm run android
npm run web

# Type checking
npx tsc --noEmit

# Linting (if configured)
npm run lint
```

## 🚀 Deployment

### Building for Production

1. **Configure app.json**
   - Update app name, slug, and version
   - Configure platform-specific settings

2. **Build for iOS**
   ```bash
   expo build:ios
   ```

3. **Build for Android**
   ```bash
   expo build:android
   ```

4. **Build for Web**
   ```bash
   expo build:web
   ```

### App Store Deployment
- Follow Expo's guide for app store submission
- Ensure all required assets and configurations are in place
- Test on physical devices before submission

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful commit messages
- Test on both iOS and Android
- Ensure accessibility compliance
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@radojicic.co or create an issue in the repository.

## 🔮 Future Roadmap

### Planned Features
- **📊 Advanced Analytics**: More detailed financial insights
- **🔄 Data Export**: Export data to CSV/PDF formats
- **☁️ Cloud Sync**: Optional cloud backup and sync
- **📱 Widgets**: Home screen widgets for quick balance viewing
- **🔔 Notifications**: Spending alerts and reminders
- **👥 Multi-User**: Family/shared account support
- **🏦 Bank Integration**: Direct bank account connections
- **📈 Investment Tracking**: Portfolio and investment management

### Technical Improvements
- **⚡ Performance**: Optimize rendering and data processing
- **🧪 Testing**: Comprehensive test coverage
- **📱 Offline Support**: Enhanced offline functionality
- **🔒 Security**: Enhanced data encryption and security
- **🌐 More Languages**: Additional language support

---

**Note**: This is a beta version. Some features may change or be added in future updates. For the latest information and updates, please visit the project repository.
