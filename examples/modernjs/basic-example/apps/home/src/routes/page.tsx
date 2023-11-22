import React from 'react';
import { Layout, Tabs, Divider } from 'antd';

import HeroImage from '../components/HeroImage';
import PageSally from '../components/PageSally';
import PageLG from '../components/PageLG';
import PageMimi from '../components/PageMimi';
import PageSammy from '../components/PageSammy';
import ProductCarousel from '../components/ProductCarousel';

const SearchList = React.lazy(() => import('search/SearchList'));

const items = [
  { label: 'Sally', key: '1', children: <PageSally /> },
  { label: 'Little Guy', key: '2', children: <PageLG /> },
  { label: 'Mimi', key: '3', children: <PageMimi /> },
  { label: 'Sammy', key: '4', children: <PageSammy /> },
];

const App = () => {
  return (
    <Layout.Content style={{ background: 'white', padding: '2em' }}>
      <Divider>Dog of the day</Divider>

      <HeroImage
        src="https://placedog.net/800/280?random"
        style={{ margin: 'auto' }}
      />

      <Tabs defaultActiveKey="1" items={items} />

      <Divider>Search</Divider>

      <React.Suspense fallback="Loading SearchList">
        <SearchList />
      </React.Suspense>

      <Divider>More Dogs</Divider>
      <ProductCarousel />
    </Layout.Content>
  );
};

export default App;
