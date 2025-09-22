import React, { useCallback, useState } from 'react';
import NavigationManager from './components/NavigationManager';
import './global.css';

export default function App() {
  // State to force re-renders when data changes
  const [dataChangeCounter, setDataChangeCounter] = useState(0);

  // Global data change handlers
  const handleDataChange = useCallback(() => {
    // This will be called when data changes in any screen
    console.log('Data changed - refreshing...');
    setDataChangeCounter(prev => prev + 1);
  }, []);

  const handleCurrencyChange = useCallback(() => {
    // This will be called when currency changes
    console.log('Currency changed - refreshing...');
  }, []);

  const handleDataReset = useCallback(() => {
    // This will be called when app data is reset
    console.log('App data reset');
  }, []);

  return (
    <NavigationManager
      onDataChange={handleDataChange}
      onCurrencyChange={handleCurrencyChange}
      onDataReset={handleDataReset}
      dataChangeCounter={dataChangeCounter}
    />
  );
}