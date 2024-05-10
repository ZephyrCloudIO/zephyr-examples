import EmptyState from '../../components/EmptyState';

import ListingClient from '../../templates/ListingClient';
import useCurrentUser from '../../common/hooks/useCurrentUser';
import useListing from '../../common/hooks/useListing';
import useReservations from '../../common/hooks/useReservations';
import { useParams } from 'react-router-dom';

const ListingPage = () => {
  const { listingId } = useParams();
  const { listing } = useListing(listingId);
  const { reservations } = useReservations({ listingId });
  const { currentUser } = useCurrentUser();

  if (!listing) {
    return <EmptyState />;
  }

  return (
    <ListingClient
      listing={listing}
      reservations={reservations}
      currentUser={currentUser}
    />
  );
};

export default ListingPage;
