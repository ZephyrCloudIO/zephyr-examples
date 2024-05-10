import EmptyState from '../../components/EmptyState';

import useCurrentUser from '../../common/hooks/useCurrentUser';
import useReservations from '../../common/hooks/useReservations';
import { Suspense, lazy } from 'react';

const TripsClient = lazy(() => import('trips/Trips'));

const TripsPage = () => {
  const { currentUser } = useCurrentUser();
  const { reservations } = useReservations({ userId: currentUser?.id });

  if (!currentUser) {
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
  }

  if (reservations.length === 0) {
    return (
      <EmptyState
        title="No trips found"
        subtitle="Looks like you havent reserved any trips."
      />
    );
  }

  return (
    <Suspense>
      <TripsClient reservations={reservations} currentUser={currentUser} />
    </Suspense>
  );
};

export default TripsPage;
