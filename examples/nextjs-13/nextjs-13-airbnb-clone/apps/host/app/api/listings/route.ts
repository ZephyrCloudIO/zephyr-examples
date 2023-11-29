import { NextResponse } from 'next/server';

import getCurrentUser from '@/app/actions/getCurrentUser';
import { listingsMock } from '@/app/mocks';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const {
    title,
    description,
    imageSrc,
    category,
    roomCount,
    bathroomCount,
    guestCount,
    location,
    price,
  } = body;

  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });

  const listing = listingsMock.push({
    id: randomUUID(),
    title,
    description,
    imageSrc,
    category,
    roomCount,
    bathroomCount,
    guestCount,
    locationValue: location.value,
    price: parseInt(price, 10),
    userId: currentUser.id,
    createdAt: new Date(),
  });

  return NextResponse.json(listing);
}
