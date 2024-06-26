import EmptyState from '../../components/EmptyState';

import useCurrentUser from '../../common/hooks/useCurrentUser';
import useReservations from '../../common/hooks/useReservations';
import { lazy } from 'react';
import RemoteWrap from '../../components/RemoteWrap';

const ReservationsClient = lazy(() => import('reservations/Reservations'));

const ReservationsPage = () => {
  const { currentUser } = useCurrentUser();
  const { reservations } = useReservations({ authorId: currentUser?.id });

  if (!currentUser) {
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
  }

  if (reservations.length === 0) {
    return (
      <EmptyState
        title="No reservations found"
        subtitle="Looks like you have no reservations on your properties."
      />
    );
  }

  return (
    <RemoteWrap remoteName="reservations">
      <ReservationsClient reservations={reservations} currentUser={currentUser} />
    </RemoteWrap>
  );
};

export default ReservationsPage;
