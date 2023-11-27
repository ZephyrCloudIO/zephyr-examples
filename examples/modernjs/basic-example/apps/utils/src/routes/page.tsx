import React from 'react';

import { sendAnalyticsMessage } from '../utils/analytics';

sendAnalyticsMessage('sendAnalytics hello');

const App: React.FC = () => {
  return <h1>Utilities Library</h1>;
};

export default App;
