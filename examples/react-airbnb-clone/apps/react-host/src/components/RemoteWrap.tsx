import { ReactNode, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import useShowRemotes from '../common/hooks/useShowRemotes';

const remotes = {
  categories: {
    border: 'border-red-600',
    text: 'text-red-600',
  },
  favorites: {
    border: 'border-blue-600',
    text: 'text-blue-600',
  },
  home: {
    border: 'border-green-600',
    text: 'text-green-600',
  },
  properties: {
    border: 'border-yellow-600',
    text: 'text-yellow-600',
  },
  reservations: {
    border: 'border-purple-600',
    text: 'text-purple-600',
  },
  trips: {
    border: 'border-teal-600',
    text: 'text-teal-600',
  },
};

interface RemoteProps {
  remoteName: keyof typeof remotes;
  children: ReactNode;
}

export default function RemoteWrap({ remoteName, children }: RemoteProps) {
  const { show } = useShowRemotes();
  return (
    <ErrorBoundary
      fallback={<div className="text-center">Error from Boundary</div>}
      onError={(error, info) => {
        console.log('---------- error: ', error);
        console.log('---------- info: ', info);
      }}
    >
      <Suspense fallback={<div className="text-center py-5">Loading Remote</div>}>
        <div
          className={show ? `border-4 ${remotes[remoteName].border} border-dashed rounded-2xl` : ''}
        >
          {children}
          {show ? (
            <p className={`text-center ${remotes[remoteName].text} my-2 font-bold text-lg`}>
              Remote: {remoteName}
            </p>
          ) : null}
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}
