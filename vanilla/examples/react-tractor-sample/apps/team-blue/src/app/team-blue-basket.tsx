// todo: split and export default

import { useEffect, useState } from 'react';

function log(...args: string[]) {
  console.log('🛒 blue-basket', ...args);
}

const state: { count: number } = {
  count: 0,
};

export default function BlueBasket({ id }: { id: string }) {
  const [classname, setClassname] = useState(
    state.count === 0 ? 'empty' : 'filled'
  );
  const [count, setCount] = useState(state.count);

  useEffect(() => {
    log('connected');
    const refresh = () => {
      log('event recieved "blue:basket:changed"');
      setCount(++state.count);
    };

    window.addEventListener('blue:basket:changed', refresh);

    return () => {
      window.removeEventListener('blue:basket:changed', refresh);
      log('disconnected');
    };
  }, []);

  return (
    <div id={id}>
      <div className={classname}>basket: {count} item(s)</div>
    </div>
  );
}
