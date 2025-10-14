
    export type RemoteKeys = 'team_blue/BlueBasket' | 'team_blue/BlueBuy';
    type PackageType<T> = T extends 'team_blue/BlueBuy' ? typeof import('team_blue/BlueBuy') :T extends 'team_blue/BlueBasket' ? typeof import('team_blue/BlueBasket') :any;