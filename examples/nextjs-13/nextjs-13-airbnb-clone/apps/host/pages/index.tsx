import Container from '../components/Container';
import ListingCard from '../components/listings/ListingCard';

import getListings from '../actions/getListings';
import getCurrentUser from '../actions/getCurrentUser';
import ClientOnly from '../components/ClientOnly';
import { GetServerSideProps } from 'next';
import { SafeListing } from '../types';
import useCurrentUser from '../hooks/useCurrentUser';

interface HomeProps {
  listings: SafeListing[];
}

export const getServerSideProps = (async ({ query }) => {
  const listings = getListings(query);
  const currentUser = getCurrentUser();

  return {
    props: {
      listings,
      currentUser,
    },
  };
}) satisfies GetServerSideProps<{}>;

const Home = ({ listings }: HomeProps) => {
  const { currentUser } = useCurrentUser();
  return (
    <ClientOnly>
      <Container>
        <div
          className="
            pt-24
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
      </Container>
    </ClientOnly>
  );
};

export default Home;
