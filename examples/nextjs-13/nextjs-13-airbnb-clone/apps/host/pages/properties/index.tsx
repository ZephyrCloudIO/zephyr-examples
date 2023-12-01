import EmptyState from '@/components/EmptyState';
import ClientOnly from '@/components/ClientOnly';

import PropertiesClient from '../../templates/PropertiesClient';
import useCurrentUser from '@/hooks/useCurrentUser';
import useListings from '@/hooks/useListings';

const PropertiesPage = () => {
  const { currentUser } = useCurrentUser();
  const { listings } = useListings({ userId: currentUser?.id });

  if (!currentUser) {
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
  }

  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState title="No properties found" subtitle="Looks like you have no properties." />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <PropertiesClient listings={listings} currentUser={currentUser} />
    </ClientOnly>
  );
};

export default PropertiesPage;
