import React, { useCallback, useState } from 'react';
import NavigationManager from './components/NavigationManager';
import { TranslationProvider } from './contexts/TranslationContext';
import './global.css';

export default function App() {
  // State to force re-renders when data changes
  const [dataChangeCounter, setDataChangeCounter] = useState(0);
  const [resetCounter, setResetCounter] = useState(0);
  const [currencyChangeCounter, setCurrencyChangeCounter] = useState(0);

  // Global data change handlers
  const handleDataChange = useCallback(() => {
    // This will be called when data changes in any screen
    setDataChangeCounter(prev => prev + 1);
  }, []);

  const handleCurrencyChange = useCallback(() => {
    // This will be called when currency changes
    setCurrencyChangeCounter(prev => prev + 1);
  }, []);

  const handleDataReset = useCallback(() => {
    // This will be called when app data is reset
    setResetCounter(prev => prev + 1);
  }, []);

  return (
    <TranslationProvider>
      <NavigationManager
        onDataChange={handleDataChange}
        onCurrencyChange={handleCurrencyChange}
        onDataReset={handleDataReset}
        dataChangeCounter={dataChangeCounter}
        resetCounter={resetCounter}
        currencyChangeCounter={currencyChangeCounter}
      />
    </TranslationProvider>
  );
}