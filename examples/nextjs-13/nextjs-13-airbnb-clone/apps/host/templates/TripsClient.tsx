import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useCallback, useState } from 'react';

import { SafeReservation, SafeUser } from '@/types';

import Heading from '@/components/Heading';
import Container from '@/components/Container';
import ListingCard from '@/components/listings/ListingCard';
import useReservations from '@/hooks/useReservations';

interface TripsClientProps {
  reservations: SafeReservation[];
  currentUser?: SafeUser | null;
}

const TripsClient: React.FC<TripsClientProps> = ({ reservations, currentUser }) => {
  const [deletingId, setDeletingId] = useState('');
  const { mutate } = useReservations({ userId: currentUser?.id });

  const onCancel = useCallback(
    (id: string) => {
      setDeletingId(id);

      axios
        .delete(`/api/reservations/${id}`)
        .then(() => {
          toast.success('Reservation cancelled');
          mutate();
        })
        .catch((error) => {
          toast.error(error?.response?.data?.error);
        })
        .finally(() => {
          setDeletingId('');
        });
    },
    [mutate],
  );

  return (
    <Container>
      <Heading title="Trips" subtitle="Where you've been and where you're going" />
      <div
        className="
          mt-10
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-6
          gap-8
        "
      >
        {reservations.map((reservation: any) => (
          <ListingCard
            key={reservation.id}
            data={reservation.listing}
            reservation={reservation}
            actionId={reservation.id}
            onAction={onCancel}
            disabled={deletingId === reservation.id}
            actionLabel="Cancel reservation"
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
};

export default TripsClient;
