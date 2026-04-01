import EmptyState from '../../components/EmptyState';

import useCurrentUser from '../../common/hooks/useCurrentUser';
import useReservations from '../../common/hooks/useReservations';
import { lazy } from 'react';
import RemoteWrap from '../../components/RemoteWrap';

const TripsClient = lazy(() => import('airbnb_trips/Trips'));

const TripsPage = () => {
  const { currentUser } = useCurrentUser();
  const { reservations } = useReservations({ userId: currentUser?.id });

  if (!currentUser) {
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
  }

  if (reservations.length === 0) {
    return (
      <EmptyState title="No trips found" subtitle="Looks like you havent reserved any trips." />
    );
  }

  return (
    <RemoteWrap remoteName="trips">
      <TripsClient reservations={reservations} currentUser={currentUser} />
    </RemoteWrap>
  );
};

export default TripsPage;
