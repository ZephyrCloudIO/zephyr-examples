import ClientOnly from '@/components/ClientOnly';
import EmptyState from '@/components/EmptyState';

import ListingClient from '../../templates/ListingClient';
import useCurrentUser from '@/hooks/useCurrentUser';
import useListing from '@/hooks/useListing';
import useReservations from '@/hooks/useReservations';
import { useRouter } from 'next/router';

interface IParams {
  listingId?: string;
}

const ListingPage = () => {
  const { query,  } = useRouter();
  const { listing } = useListing(query?.listingId as string);
  const { reservations } = useReservations({
    listingId: query?.listingId as string,
  });
  const { currentUser } = useCurrentUser();

  if (!listing) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ListingClient
        listing={listing}
        reservations={reservations}
        currentUser={currentUser}
      />
    </ClientOnly>
  );
};

export default ListingPage;
