import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import { listingsMock, reservationsMock } from '@/app/mocks';
import { randomUUID } from 'crypto';

export async function POST(
  request: Request, 
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { 
    listingId,
    startDate,
    endDate,
    totalPrice
   } = body;

   if (!listingId || !startDate || !endDate || !totalPrice) {
    return NextResponse.error();
  }

  const reservation = reservationsMock.push({
    id: randomUUID(),
    listingId,
    createdAt: new Date(),
    userId: currentUser.id,
    startDate,
    endDate,
    totalPrice,
  });

  const listingAndReservation = {
    ...listingsMock.find(({id}) => id === listingId)!,
    reservations: [reservation]
  }

  return NextResponse.json(listingAndReservation);
}
