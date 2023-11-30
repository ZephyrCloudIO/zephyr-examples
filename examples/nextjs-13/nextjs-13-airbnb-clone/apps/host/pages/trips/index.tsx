import EmptyState from '@/components/EmptyState';
import ClientOnly from '@/components/ClientOnly';

import TripsClient from '../../templates/TripsClient';
import useCurrentUser from '@/hooks/useCurrentUser';
import useReservations from '@/hooks/useReservations';

const TripsPage = () => {
  const { currentUser } = useCurrentUser();
  const { reservations } = useReservations({ userId: currentUser?.id });

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState title="Unauthorized" subtitle="Please login" />
      </ClientOnly>
    );
  }

  if (reservations.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No trips found"
          subtitle="Looks like you havent reserved any trips."
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <TripsClient reservations={reservations} currentUser={currentUser} />
    </ClientOnly>
  );
};

export default TripsPage;
