const { createDelegatedModule } = require('@module-federation/utilities');

/**
 * @typedef {{
 *  isServer: boolean;
 *  delegatePath: string;
 *  remoteMap: {
 *    [globalName: string]: string;
 *  };
 * }} ResolverOptions
 */

/**
 *
 * @param {ResolverOptions} options
 * @returns
 */
const remotesResolver = ({ isServer, remoteMap, delegatePath }) => {
  const location = isServer ? 'ssr' : 'chunks';

  return Object.entries(remoteMap || {}).reduce((acc, [globalName, url]) => {
    return {
      ...acc,
      [globalName]: createDelegatedModule(delegatePath, {
        remote: `${globalName}@${url.replace('__LOCATION__', location)}`,
      }),
    };
  }, {});
};

exports.remotesResolver = remotesResolver;
