import { Divider, ThemeProvider, Typography } from '@material-ui/core';

import Dialog from './Dialog';
import { HashRouter } from 'react-router-dom';
import React from 'react';
import Tabs from './Tabs';
import { theme } from './theme';

function App() {
  return (
    <HashRouter>
      <ThemeProvider theme={theme}>
        <React.Suspense fallback={null}>
          <Typography variant="h6">Dialog Component</Typography>
          <Dialog />
          <Divider style={{ margin: '16px 0' }} />
          <Typography variant="h6">Tabs Component</Typography>
          <Tabs />
        </React.Suspense>
      </ThemeProvider>
    </HashRouter>
  );
}

export default App;