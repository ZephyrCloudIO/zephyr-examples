
    export type RemoteKeys = 'remote/recipe';
    type PackageType<T> = T extends 'remote/recipe' ? typeof import('remote/recipe') :any;