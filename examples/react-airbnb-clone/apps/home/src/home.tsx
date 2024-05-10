import ListingCard from './components/listings/ListingCard';

import useCurrentUser from './common/hooks/useCurrentUser';
import { useSearchParams } from 'react-router-dom';
import useListings from './common/hooks/useListings';

const Home = () => {
  const [query] = useSearchParams();
  const { currentUser } = useCurrentUser();
  const { listings } = useListings(Object.fromEntries(query.entries()));

  return (
    <div
      className="
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
      {listings.map((listing: any) => (
        <ListingCard
          currentUser={currentUser}
          key={listing.id}
          data={listing}
        />
      ))}
    </div>
  );
};

export default Home;
