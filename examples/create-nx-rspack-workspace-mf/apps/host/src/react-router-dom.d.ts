declare module 'react-router-dom' {
  import * as React from 'react';

  export interface RouteProps {
    path?: string;
    element?: React.ReactNode;
    index?: boolean;
    children?: React.ReactNode;
  }

  export interface RoutesProps {
    children?: React.ReactNode;
  }

  export interface LinkProps {
    to: string;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export const Route: React.FC<RouteProps>;
  export const Routes: React.FC<RoutesProps>;
  export const Link: React.FC<LinkProps>;
  export const BrowserRouter: React.FC<{ children?: React.ReactNode }>;
}