import { NextResponse } from 'next/server';

import getCurrentUser from '@/app/actions/getCurrentUser';
import { listingsMock } from '@/app/mocks';

interface IParams {
  listingId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid ID');
  }

  const listingIndex = listingsMock.findIndex(
    ({ id, userId }) => id === listingId && userId === currentUser.id
  );

  const listing = { ...listingsMock[listingIndex] };
  listingsMock.splice(listingIndex, 1)

  return NextResponse.json(listing);
}
