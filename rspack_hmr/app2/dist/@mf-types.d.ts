
    export type RemoteKeys = 'REMOTE_ALIAS_IDENTIFIER/Hello' | 'REMOTE_ALIAS_IDENTIFIER/pi';
    type PackageType<T> = T extends 'REMOTE_ALIAS_IDENTIFIER/pi' ? typeof import('REMOTE_ALIAS_IDENTIFIER/pi') :T extends 'REMOTE_ALIAS_IDENTIFIER/Hello' ? typeof import('REMOTE_ALIAS_IDENTIFIER/Hello') :any;