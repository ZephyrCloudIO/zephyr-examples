import { Listing, Reservation, User } from '../types';

export const usersMock: User[] = [
  {
    id: '7f514879-8a96-4e14-ba6d-5c7ecd3d5b66',
    email: 'test@test.com',
    createdAt: new Date('2023-11-28T14:48:50.669Z'),
    updatedAt: new Date('2023-11-28T14:48:50.669Z'),
    favoriteIds: [],
    name: 'Test User',
  },
  {
    id: '3ed934b1-6f91-49d5-83af-55e2f7b5c2fb',
    email: 'test2@test.com',
    createdAt: new Date('2023-11-28T14:48:50.669Z'),
    updatedAt: new Date('2023-11-28T14:48:50.669Z'),
    favoriteIds: [],
    name: 'Test User 2',
  },
];

export const listingsMock: Listing[] = [
  {
    id: '41f0a118-5123-42d0-bcec-6b2f08b86945',
    title: 'Great Apartment at the Beach',
    description: 'Great location and amazing view',
    imageSrc: 'https://picsum.photos/id/77/1280/792',
    createdAt: new Date('2023-11-24T14:48:50.669Z'),
    category: 'Beach',
    roomCount: 3,
    bathroomCount: 2,
    guestCount: 5,
    locationValue: 'US',
    userId: usersMock[0].id,
    price: 1000,
  },
  {
    id: 'd3b125ec-6b97-4289-871c-670a3c0a219e',
    title: 'Pool House',
    description: 'Relaxing place to take a vacation',
    imageSrc: 'https://picsum.photos/id/49/1280/792',
    createdAt: new Date('2023-11-20T14:48:50.669Z'),
    category: 'Countryside',
    roomCount: 4,
    bathroomCount: 3,
    guestCount: 6,
    locationValue: 'GR',
    userId: usersMock[0].id,
    price: 1500,
  },
  {
    id: '69acc17a-914d-4edd-bff1-0b613714ef57',
    title: 'Big Lake House',
    description: 'Come to enjoy the wilderness',
    imageSrc: 'https://picsum.photos/id/424/1280/792',
    createdAt: new Date('2023-11-22T14:48:50.669Z'),
    category: 'Lake',
    roomCount: 3,
    bathroomCount: 2,
    guestCount: 5,
    locationValue: 'BR',
    userId: usersMock[1].id,
    price: 600,
  },
];

export const reservationsMock: Reservation[] = [
  {
    id: '39b3a7ef-e32c-46fb-8a39-0849b86e0ec2',
    createdAt: new Date('2023-11-25T14:48:50.669Z'),
    endDate: new Date('2023-11-30T14:48:50.669Z'),
    listingId: '69acc17a-914d-4edd-bff1-0b613714ef57',
    startDate: new Date('2023-11-29T14:48:50.669Z'),
    totalPrice: 700,
    userId: '7f514879-8a96-4e14-ba6d-5c7ecd3d5b66'
  },
  {
    id: '9ef059ee-daa5-4aa6-a6eb-93a675a01d0e',
    createdAt: new Date('2023-11-25T14:48:50.669Z'),
    endDate: new Date('2023-11-30T14:48:50.669Z'),
    listingId: 'd3b125ec-6b97-4289-871c-670a3c0a219e',
    startDate: new Date('2023-11-29T14:48:50.669Z'),
    totalPrice: 700,
    userId: '3ed934b1-6f91-49d5-83af-55e2f7b5c2fb'
  },
] 
