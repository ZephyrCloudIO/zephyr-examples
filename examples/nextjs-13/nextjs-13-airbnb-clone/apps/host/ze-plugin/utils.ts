import { importDelegatedModule } from '@module-federation/utilities';
import {
  DEBUG_ERROR_HEADER,
  DEBUG_LOG_HEADER,
  DEFAULT_API_URL,
  DEFAULT_VERSIONED_REMOTE_NAME_SCHEMA,
} from './constants';

export interface ImportVersionedRemoteOptions {
  /**
   * Whether to enable debug mode.
   */
  debug?: boolean;
  /**
   * The API URL to be used to fetch the remote version.
   *
   * Defaults to `https://api.zephyr-cloud.io/`.
   */
  apiUrl?: string;
  /**
   * Additional params to be passed to the dashboard API.
   */
  additionalParams?: Record<string, string>;
  /**
   * The schema to be used to generate the versioned remote name.
   *
   * Defaults to `__REMOTE_NAME__` + `_` + `__REMOTE_VERSION__`.
   */
  versionedRemoteNameSchema?: string;
  /**
   * The current host to be passed to the dashboard API.
   */
  currentHost: string;
  /**
   * The remote name to be passed to the dashboard API.
   */
  remoteName: string;
  /**
   * The remote URL with the placeholders `__REMOTE_URL__` and `__REMOTE_VERSION__` to be replaced by the remote URL and version respectively.
   */
  remoteUrl: string;
}

export interface Container {
  fake?: boolean;
  init(shareScope: (typeof __webpack_share_scopes__)[string]): void;
  get<T>(module: string): T;
}

/**
 * Imports a versioned remote.
 * @param options
 * @returns The imported versioned remote.
 */
export async function importVersionedRemote(
  options: ImportVersionedRemoteOptions,
): Promise<Container> {
  const {
    debug = false,
    apiUrl = DEFAULT_API_URL,
    versionedRemoteNameSchema = DEFAULT_VERSIONED_REMOTE_NAME_SCHEMA,
    additionalParams,
    currentHost,
    remoteName,
    remoteUrl,
  } = options;

  if (debug) {
    console.debug(
      `[${DEBUG_LOG_HEADER}]: importVersionedRemote options`,
      options,
    );
  }

  if (!remoteName) {
    throw new Error(
      `[${DEBUG_ERROR_HEADER}]: Expected remoteName but none was provided`,
    );
  }

  try {
    const dashboardParams = new URLSearchParams({
      remoteName,
      currentHost,
      ...additionalParams,
    } as Record<string, string>);

    const resolvedApiUrl = `${apiUrl}&${dashboardParams.toString()}`;

    if (debug) {
      console.debug(`[${DEBUG_LOG_HEADER}]: resolvedApiUrl`, resolvedApiUrl);
    }

    const remoteVersionReq = await fetch(resolvedApiUrl);

    if (!remoteVersionReq.ok) {
      throw new Error(
        `[${DEBUG_ERROR_HEADER}]: Failed to fetch remote version from API: ${remoteVersionReq.statusText}`,
      );
    }

    const remoteData = await remoteVersionReq.json();

    const resolvedRemoteVersion = remoteData.version;
    const remoteParsedUrl = remoteUrl
      .replace(/__REMOTE_URL__/g, remoteData.remoteURL)
      .replace(/__REMOTE_VERSION__/g, resolvedRemoteVersion);

    if (debug) {
      console.debug(`[${DEBUG_LOG_HEADER}]: remoteParsedUrl`, remoteParsedUrl);
    }

    const resolvedVersionedRemoteName = versionedRemoteNameSchema
      .replace(/__REMOTE_NAME__/g, remoteName)
      .replace(/__REMOTE_VERSION__/g, resolvedRemoteVersion);

    // importing the delegated module
    const importedRemote = await importDelegatedModule({
      global: resolvedVersionedRemoteName,
      url: remoteParsedUrl,
    });

    if (debug) {
      console.debug(`[${DEBUG_LOG_HEADER}]: importedRemote`, importedRemote);
    }

    return importedRemote;
  } catch (error) {
    throw new Error(`[${DEBUG_ERROR_HEADER}]:`, {
      cause: error,
    });
  }
}
