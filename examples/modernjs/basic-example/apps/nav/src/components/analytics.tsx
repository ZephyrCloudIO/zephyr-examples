let sendAnalyticsMessage = null;
const pending = [];

const utils = import('utils/analytics').then(mod => {
  // eslint-disable-next-line prefer-destructuring
  sendAnalyticsMessage = mod.sendAnalyticsMessage;
  pending.forEach(sendAnalyticsMessage);
});

export const sendMessage = async msg => {
  await utils;
  if (sendAnalyticsMessage) {
    sendAnalyticsMessage(msg);
  } else {
    pending.push(msg);
  }
};
