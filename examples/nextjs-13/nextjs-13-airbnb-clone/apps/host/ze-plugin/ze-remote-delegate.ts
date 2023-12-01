export default function (resourceQuery: string) {
  return new Promise(async (resolve, reject) => {
    const debug = Boolean(
      process.env.DEBUG &&
        (process.env.DEBUG === 'true' ||
          process.env.DEBUG === '1' ||
          process.env.DEBUG.includes('ze:remote-delegate') ||
          process.env.DEBUG.includes('ze:*')),
    );

    const { importVersionedRemote } = await import('./utils');

    if (!resourceQuery) {
      reject(
        "Running the delegate in a non-delegate-remote context. Missing 'resourceQuery' in the context.",
      );
    }

    if (!debug) {
      console.debug(
        `Delegate being called for ${resourceQuery} from ${__webpack_runtime_id__}`,
      );
    }

    const currentRequest = new URLSearchParams(resourceQuery);
    const remote = currentRequest.get('remote') || '';

    if (!remote) {
      reject('No remote name provided');
    }

    // This one comes from the DefinePlugin on the FederationDashboardPlugin
    const currentHost = process.env.CURRENT_HOST as string;

    if (!currentHost) {
      reject('No current host provided');
    }

    const [remoteName, remoteUrl] = remote.split('@');

    // We need to make sure this DefinePlugin is set on the host webpack config
    // new DefinePlugin({
    //   'process.env.ZE_DASHBOARD_API_URL': JSON.stringify(process.env.ZE_DASHBOARD_API_URL),
    //   'process.env.ZE_DASHBOARD_ENV': JSON.stringify(zeEnvironment),
    //   'process.env.ZE_READ_TOKEN': JSON.stringify(process.env.ZE_READ_TOKEN),
    // }),
    const apiUrl = `${process.env.ZE_DASHBOARD_API_URL}/env/${process.env.ZE_DASHBOARD_ENV}/get-remote?token=${process.env.ZE_READ_TOKEN}`;

    try {
      resolve(
        importVersionedRemote({
          debug,
          apiUrl,
          remoteName,
          currentHost,
          remoteUrl,
        }),
      );
    } catch (error) {
      reject(error);
    }
  });
}
