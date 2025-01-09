
export const config = {
  name: 'consumer',
  remotes: {
    producer: 'producer@http://localhost:3001/remoteEntry.js',
  },
  shared: ['react', 'react-dom'],
}