// Workaround for TS issues:
// https://github.com/infinitered/reactotron/issues/1430#issuecomment-2180872830
const Reactotron = require('reactotron-react-native').default;

Reactotron.configure().useReactNative().connect();
