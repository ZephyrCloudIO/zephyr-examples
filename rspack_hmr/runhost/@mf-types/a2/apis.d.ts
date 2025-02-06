
    export type RemoteKeys = 'a2/Hello' | 'a2/pi';
    type PackageType<T> = T extends 'a2/pi' ? typeof import('a2/pi') :T extends 'a2/Hello' ? typeof import('a2/Hello') :any;