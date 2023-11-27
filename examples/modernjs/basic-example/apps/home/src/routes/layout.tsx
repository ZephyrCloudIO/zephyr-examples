import React from 'react';
import { Layout } from 'antd';
import { Outlet } from '@modern-js/runtime/router';

import { sendMessage } from '../components/analytics';

const Header = React.lazy(() => import('nav/Header'));
const Footer = React.lazy(() => import('nav/Footer'));

const App = () => {
  sendMessage('Application loaded');
  return (
    <Layout style={{ maxWidth: 1200, margin: 'auto' }}>
      <React.Suspense fallback="Loading SearchList">
        <Header>Home Page</Header>
      </React.Suspense>
      <Outlet></Outlet>
      <React.Suspense fallback="Loading SearchList">
        <Footer>Home Page</Footer>
      </React.Suspense>
    </Layout>
  );
};

export default App;
