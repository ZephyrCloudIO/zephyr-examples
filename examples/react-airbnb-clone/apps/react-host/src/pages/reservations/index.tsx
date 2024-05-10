import EmptyState from '../../components/EmptyState';

import TripsClient from '../../templates/ReservationsClient';
import useCurrentUser from '../../common/hooks/useCurrentUser';
import useReservations from '../../common/hooks/useReservations';

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

  return <TripsClient reservations={reservations} currentUser={currentUser} />;
};

export default ReservationsPage;
