import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import restart from 'react-native-restart-app';
import App from './src/App.tsx';

export default function EntryPoint() {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        restart();
        console.log('Restarting app');
      }

      appState.current = nextAppState;
      console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return <App />;
}
