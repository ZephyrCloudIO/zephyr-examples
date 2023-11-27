import React from 'react';
import { Layout } from 'antd';

import { sendMessage } from '../components/analytics';

import Header from '../components/Header';
import Footer from '../components/Footer';

const App: React.FC = () => {
  sendMessage('loaded');
  return (
    <Layout style={{ maxWidth: 1200, margin: 'auto' }}>
      <Header>Navigation Site</Header>
      <Layout.Content style={{ background: 'white', padding: '2em' }}>Some content for yah!</Layout.Content>
      <Footer>Navigation Site</Footer>
    </Layout>
  );
};

export default App;
