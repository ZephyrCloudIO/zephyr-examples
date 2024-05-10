import EmptyState from '../../components/EmptyState';
import useCurrentUser from '../../common/hooks/useCurrentUser';
import useListings from '../../common/hooks/useListings';
import { Suspense, lazy } from 'react';

const PropertiesClient = lazy(() => import('properties/Properties'));

const PropertiesPage = () => {
  const { currentUser } = useCurrentUser();
  const { listings } = useListings({ userId: currentUser?.id });

  if (!currentUser) {
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
  }

  if (listings.length === 0) {
    return (
      <EmptyState
        title="No properties found"
        subtitle="Looks like you have no properties."
      />
    );
  }

  return (
    <Suspense>
      <PropertiesClient listings={listings} currentUser={currentUser} />
    </Suspense>
  );
};

export default PropertiesPage;
