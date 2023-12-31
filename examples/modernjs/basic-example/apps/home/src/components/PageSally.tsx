import React from 'react';

import HeroImage from './HeroImage';

import { sendMessage } from './analytics';

const Button = React.lazy(() => import('dsl/Button'));

const PageSally = () => {
  sendMessage('PageSally Loaded');
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '25% 50% 20%',
        gridGap: '1em',
      }}
    >
      <HeroImage
        src="https://placedog.net/530/280?random"
        style={{ width: '100%' }}
      />
      <div>
        <h2>Sally</h2>
        <p>Sally is a great dog.</p>
      </div>
      <React.Suspense fallback={<div />}>
        <Button>Adopt this dog!</Button>
      </React.Suspense>
    </div>
  );
};

export default PageSally;
