import EmptyState from '@/components/EmptyState';
import ClientOnly from '@/components/ClientOnly';

import TripsClient from '../../templates/ReservationsClient';
import useCurrentUser from '@/hooks/useCurrentUser';
import useReservations from '@/hooks/useReservations';

const ReservationsPage = () => {
  const { currentUser } = useCurrentUser();
  const { reservations } = useReservations({ authorId: currentUser?.id });

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
        <EmptyState title="No reservations found" subtitle="Looks like you have no reservations on your properties." />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <TripsClient reservations={reservations} currentUser={currentUser} />
    </ClientOnly>
  );
};

export default ReservationsPage;
