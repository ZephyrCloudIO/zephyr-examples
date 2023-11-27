import React from 'react';
import Button from '../components/Button';
import Carousel from '../components/Carousel';
import TextField from '../components/TextField';

const App: React.FC = () => {
  return (
    <main>
      <h1>DSL Test Page</h1>
      <Button>Something buttony</Button>
      <TextField />
      <Carousel slidesToShow={4} style={{ maxHeight: 200 }}>
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
      </Carousel>
    </main>
  );
};

export default App;
