// import { importDelegatedModule } from '@module-federation/utilities';

// TODO: replace by consuming the related version from dashboard metadata
const relatedRemoteVersions: Record<string, string> = {
  a0603bf16baf79c4: '91c63db724f937b9',
};

module.exports = new Promise(async (resolve, reject) => {
  const { importDelegatedModule } = await import('@module-federation/utilities');
  const isServer = typeof window === 'undefined';

  console.log('isServer', isServer);

  console.log('__resourceQuery', __resourceQuery);

  const currentRequest = new URLSearchParams(__resourceQuery);
  const remote = currentRequest.get('remote') || '';

  console.log('remote', remote);

  if (!remote) {
    reject('No remote name provided');
  }

  const [globalRemoteName, remoteUrl] = remote.split('@');

  console.log('globalRemoteName', globalRemoteName);
  console.log('remoteUrl', remoteUrl);

  // Logging the delegate being called for the resourceQuery from the webpack runtime ID
  console.debug(`Delegate being called for ${__resourceQuery} from ${__webpack_runtime_id__}`);

  try {
    const dashboardParams = new URLSearchParams({
      remoteName: globalRemoteName,
      currentHost: process.env.CURRENT_HOST,
    } as Record<string, string>);

    const dashboardURL = `${process.env.DASHBOARD_CLIENT_URL}&${dashboardParams.toString()}`;

    console.log('dashboardURL', dashboardURL);

    const remoteVersionReq = await fetch(dashboardURL);

    if (!remoteVersionReq.ok) {
      throw new Error(`Failed to fetch remote version from dashboard: ${remoteVersionReq.statusText}`);
    }

    const remoteData = await remoteVersionReq.json();
    // const remoteKeyName = `${remoteData.name}_${remoteData.version}`;
    // const remoteEntryFilename = `${remoteData.version}.remoteEntry.js`;
    // const remoteEntryFileUrl = new URL(remoteEntryFilename, remoteData.remoteURL);

    // TODO: replace by consuming the related version from dashboard metadata
    const resolvedRemoteVersion = isServer ? relatedRemoteVersions[remoteData.version] : remoteData.version;

    const remoteParsedUrl = remoteUrl.replace('__REMOTE_URL__', remoteData.remoteURL).replace('__REMOTE_VERSION__', resolvedRemoteVersion);

    console.log('remoteParsedUrl', remoteParsedUrl);

    const versionedGlobalRemoteName = `${globalRemoteName}_${resolvedRemoteVersion}`;

    // importing the delegated module
    const importedRemote = await importDelegatedModule({
      global: versionedGlobalRemoteName,
      url: remoteParsedUrl,
    });
    console.log('importedRemote', importedRemote);

    // resolving the remote
    resolve(importedRemote);
  } catch (error) {
    // catching the error and rejecting it
    reject(error);
  }
});