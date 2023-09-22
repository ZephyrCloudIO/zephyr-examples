/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

const extractUrlAndGlobal = (urlAndGlobal) => {
  const index = urlAndGlobal.indexOf('@');
  if (index <= 0 || index === urlAndGlobal.length - 1) {
    throw new Error(`Invalid request "${urlAndGlobal}"`);
  }
  return [urlAndGlobal.substring(index + 1), urlAndGlobal.substring(0, index)];
};

const remoteVars = process.env['REMOTES'] || {};

const getRuntimeRemotes = () => {
  try {
    const runtimeRemotes = Object.entries(remoteVars).reduce(function (
      acc,
      item
    ) {
      const [key, value] = item;
      // if its an object with a thenable (eagerly executing function)
      if (typeof value === 'object' && typeof value.then === 'function') {
        acc[key] = { asyncContainer: value };
      }
      // if its a function that must be called (lazily executing function)
      else if (typeof value === 'function') {
        acc[key] = { asyncContainer: value };
      }
      // if its a delegate module, skip it
      else if (typeof value === 'string' && value.startsWith('internal ')) {
        const [request, query] = value.replace('internal ', '').split('?');
        if (query) {
          const remoteSyntax = new URLSearchParams(query).get('remote');
          if (remoteSyntax) {
            const [url, global] = extractUrlAndGlobal(remoteSyntax);
            acc[key] = { global, url };
          }
        }
      }
      // if its just a string (global@url)
      else if (typeof value === 'string') {
        const [url, global] = extractUrlAndGlobal(value);
        acc[key] = { global, url };
      }
      // we dont know or currently support this type
      else {
        console.warn('remotes process', process.env.REMOTES);
        throw new Error(
          `[mf] Invalid value received for runtime_remote "${key}"`
        );
      }
      return acc;
    },
    {});

    return runtimeRemotes;
  } catch (err) {
    console.warn('Unable to retrieve runtime remotes: ', err);
  }

  return {};
};

const loadScript = (keyOrRuntimeRemoteItem) => {
  const runtimeRemotes = getRuntimeRemotes();

  // 1) Load remote container if needed
  let asyncContainer;
  const reference =
    typeof keyOrRuntimeRemoteItem === 'string'
      ? runtimeRemotes[keyOrRuntimeRemoteItem]
      : keyOrRuntimeRemoteItem;

  if (reference.asyncContainer) {
    asyncContainer =
      typeof reference.asyncContainer.then === 'function'
        ? reference.asyncContainer
        : reference.asyncContainer();
  } else {
    // This casting is just to satisfy typescript,
    // In reality remoteGlobal will always be a string;
    const remoteGlobal = reference.global;

    // Check if theres an override for container key if not use remote global
    const containerKey = reference.uniqueKey
      ? reference.uniqueKey
      : remoteGlobal;

    const __webpack_error__ = new Error();

    if (!globalThis.__remote_scope__) {
      // create a global scope for container, similar to how remotes are set on window in the browser

      globalThis.__remote_scope__ = {
        _config: {},
      };
    }

    const globalScope =
      typeof window !== 'undefined' ? window : globalThis.__remote_scope__;

    if (typeof window === 'undefined') {
      globalScope['_config'][containerKey] = reference.url;
    } else {
      // to match promise template system, can be removed once promise template is gone
      if (!globalScope['remoteLoading']) {
        globalScope['remoteLoading'] = {};
      }
      if (globalScope['remoteLoading'][containerKey]) {
        return globalScope['remoteLoading'][containerKey];
      }
    }

    asyncContainer = new Promise(function (resolve, reject) {
      function resolveRemoteGlobal() {
        const asyncContainer = globalScope[remoteGlobal];
        return resolve(asyncContainer);
      }

      if (typeof globalScope[remoteGlobal] !== 'undefined') {
        return resolveRemoteGlobal();
      }

      __webpack_require__.l(
        reference.url,
        function (event) {
          if (typeof globalScope[remoteGlobal] !== 'undefined') {
            return resolveRemoteGlobal();
          }

          const errorType =
            event && (event.type === 'load' ? 'missing' : event.type);
          const realSrc = event && event.target && event.target.src;

          __webpack_error__.message =
            'Loading script failed.\n(' +
            errorType +
            ': ' +
            realSrc +
            ' or global var ' +
            remoteGlobal +
            ')';

          __webpack_error__.name = 'ScriptExternalLoadError';
          __webpack_error__.type = errorType;
          __webpack_error__.request = realSrc;

          reject(__webpack_error__);
        },
        containerKey
      );
    }).catch(function (err) {
      console.error('container is offline, returning fake remote');
      console.error(err);

      return {
        fake: true,

        get: (arg) => {
          console.warn('faking', arg, 'module on, its offline');

          return Promise.resolve(() => {
            return {
              __esModule: true,
              default: () => {
                return null;
              },
            };
          });
        },
        //eslint-disable-next-line
        init: () => {},
      };
    });
    if (typeof window !== 'undefined') {
      globalScope['remoteLoading'][containerKey] = asyncContainer;
    }
  }

  return asyncContainer;
};

const importDelegatedModule = async (keyOrRuntimeRemoteItem) => {
  return loadScript(keyOrRuntimeRemoteItem)
    .then((asyncContainer) => {
      return asyncContainer;
    })
    .then((asyncContainer) => {
      // most of this is only needed because of legacy promise based implementation
      // can remove proxies once we remove promise based implementations
      if (typeof window === 'undefined') {
        if (!Object.hasOwnProperty.call(keyOrRuntimeRemoteItem, 'global')) {
          return asyncContainer;
        }

        // return asyncContainer;

        //TODO: need to solve chunk flushing with delegated modules
        return {
          get: function (arg) {
            return asyncContainer.get(arg).then((f) => {
              const m = f();
              const result = {
                __esModule: m.__esModule,
              };
              for (const prop in m) {
                if (typeof m[prop] === 'function') {
                  Object.defineProperty(result, prop, {
                    get: function () {
                      return function () {
                        if (globalThis.usedChunks)
                          globalThis.usedChunks.add(
                            `${keyOrRuntimeRemoteItem.global}->${arg}`
                          );
                        //eslint-disable-next-line prefer-rest-params
                        return m[prop](...arguments);
                      };
                    },
                    enumerable: true,
                  });
                } else {
                  Object.defineProperty(result, prop, {
                    get: () => {
                      if (globalThis.usedChunks)
                        globalThis.usedChunks.add(
                          `${keyOrRuntimeRemoteItem.global}->${arg}`
                        );

                      return m[prop];
                    },
                    enumerable: true,
                  });
                }
              }

              if (m.then) {
                return Promise.resolve(() => result);
              }

              return () => result;
            });
          },
          init: asyncContainer.init,
        };
      } else {
        return asyncContainer;
      }
    });
};

// eslint-disable-next-line no-async-promise-executor
module.exports = new Promise(async (resolve, reject) => {
  // eslint-disable-next-line no-undef
  const currentRequest = new URLSearchParams(__resourceQuery).get('remote');
  const [global, url] = currentRequest.split('@');
  importDelegatedModule({
    global,
    url: url + '?' + Date.now(),
  })
    .then((remote) => {
      resolve(remote);
    })
    .catch((err) => reject(err));
});
