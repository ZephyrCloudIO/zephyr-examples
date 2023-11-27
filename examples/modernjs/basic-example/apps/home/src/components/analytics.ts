let sendAnalyticsMessage = null;

const utils = import('utils/analytics').then(mod => {
  // eslint-disable-next-line prefer-destructuring
  sendAnalyticsMessage = mod.sendAnalyticsMessage;
});

export const sendMessage = async msg => {
  await utils;
  sendAnalyticsMessage(msg);
};
