import { Suspense, lazy } from 'react';

import HeroImage from './HeroImage';

import { sendMessage } from './analytics';

const Button = lazy(() => import('dsl/Button'));

const PageMimi = () => {
  sendMessage('PageMimi Loaded');
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '25% 50% 20%',
        gridGap: '1em',
      }}
    >
      <HeroImage
        src="https://placedog.net/520/280?random"
        style={{ width: '100%' }}
      />
      <div>
        <h2>Mimi</h2>
        <p>Mimi is a great dog.</p>
      </div>
      <Suspense fallback={<div />}>
        <Button>Adopt this dog!</Button>
      </Suspense>
    </div>
  );
};

export default PageMimi;
