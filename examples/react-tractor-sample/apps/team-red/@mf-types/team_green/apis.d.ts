
    export type RemoteKeys = 'team_green/GreenRecos';
    type PackageType<T> = T extends 'team_green/GreenRecos' ? typeof import('team_green/GreenRecos') :any;