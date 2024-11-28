import { useState } from 'react';
import './Button.css';

const Button = () => {
  const [count, setCount] = useState(0);
  return (
    <div className="card-border">
      <div className="card">
        {' '}
        <p>This is a button from Vite remote.</p>
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </div>
  );
};

export default Button;
