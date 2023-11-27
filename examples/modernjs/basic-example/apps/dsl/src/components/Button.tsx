import { Button } from 'antd';

console.log(
  `REMOTE FEDERATION MANAGEMENT: using remote version: ${
    // eslint-disable-next-line import/no-commonjs, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    require('../../package.json').version
  }`,
);

// red
// green
// blue
const MyButton = ({ children }) => (
  <Button type="primary" style={{ background: 'green' }}>
    {children}
  </Button>
);

export default MyButton;
