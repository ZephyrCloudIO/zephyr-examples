import { toast } from 'react-hot-toast';
import { useCallback, useState } from 'react';

import { SafeReservation, User } from './common/types';
import Heading from './components/Heading';
import Container from './components/Container';
import ListingCard from './components/listings/ListingCard';
import useReservations from './common/hooks/useReservations';
import axios from './common//libs/axios';

interface ReservationsClientProps {
  reservations: SafeReservation[];
  currentUser?: User | null;
}

const ReservationsClient: React.FC<ReservationsClientProps> = ({
  reservations,
  currentUser,
}) => {
  const [deletingId, setDeletingId] = useState('');
  const { mutate } = useReservations({ authorId: currentUser?.id });

  const onCancel = useCallback(
    (id: string) => {
      setDeletingId(id);

      axios
        .delete(`/api/reservations/${id}`)
        .then(() => {
          toast.success('Reservation cancelled');
          mutate();
        })
        .catch(() => {
          toast.error('Something went wrong.');
        })
        .finally(() => {
          setDeletingId('');
        });
    },
    [mutate],
  );

  return (
    <Container>
      <Heading title="Reservations" subtitle="Bookings on your properties" />
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
            actionLabel="Cancel guest reservation"
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
};

export default ReservationsClient;
