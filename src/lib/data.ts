import type { User, Hotel, Room, Booking, NewHotel } from './types';

// Using a Map to make data mutable for admin actions demo
const users: Map<string, User> = new Map([
  ['user-1', { id: 'user-1', name: 'John Doe', email: 'john.doe@example.com', role: 'user', createdAt: new Date() }],
  ['user-2', { id: 'user-2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'owner', createdAt: new Date() }],
  ['user-3', { id: 'user-3', name: 'Admin User', email: 'admin@lodgify.lite', role: 'admin', createdAt: new Date() }],
  ['user-4', { id: 'user-4', name: 'Peter Jones', email: 'peter.jones@example.com', role: 'owner', createdAt: new Date() }],
  ['user-5', { id: 'user-5', name: 'Mary Williams', email: 'mary.williams@example.com', role: 'user', createdAt: new Date() }],
]);

const hotels: Map<string, Hotel> = new Map([
  ['hotel-1', { id: 'hotel-1', name: 'The Grand Budapest', location: 'Zubrowka', description: 'A luxurious hotel with a rich history, nestled in the heart of the mountains.', ownerId: 'user-2', status: 'approved', coverImage: 'https://placehold.co/1200x800.png', createdAt: new Date(), 'data-ai-hint': 'hotel luxury' }],
  ['hotel-2', { id: 'hotel-2', name: 'Seaside Serenity', location: 'Coastal City', description: 'A charming hotel by the sea, awaiting your approval.', ownerId: 'user-2', status: 'pending', coverImage: 'https://placehold.co/1200x800.png', createdAt: new Date(), 'data-ai-hint': 'hotel beach' }],
  ['hotel-3', { id: 'hotel-3', name: 'Urban Oasis', location: 'Metropolis', description: 'A modern hotel in the city center.', ownerId: 'user-2', status: 'approved', coverImage: 'https://placehold.co/1200x800.png', createdAt: new Date(), 'data-ai-hint': 'hotel city' }],
  ['hotel-4', { id: 'hotel-4', name: 'Mountain Retreat', location: 'Alpine Village', description: 'A cozy retreat for mountain lovers.', ownerId: 'user-4', status: 'approved', coverImage: 'https://placehold.co/1200x800.png', createdAt: new Date(), 'data-ai-hint': 'hotel mountain' }],
  ['hotel-5', { id: 'hotel-5', name: 'Desert Mirage', location: 'Sandy Plains', description: 'An oasis of luxury in the vast desert.', ownerId: 'user-4', status: 'pending', coverImage: 'https://placehold.co/1200x800.png', createdAt: new Date(), 'data-ai-hint': 'hotel desert' }],
  ['hotel-6', { id: 'hotel-6', name: 'Forest Hideaway', location: 'Redwood Forest', description: 'A secluded cabin complex in the woods.', ownerId: 'user-4', status: 'approved', coverImage: 'https://placehold.co/1200x800.png', createdAt: new Date(), 'data-ai-hint': 'hotel forest' }],
]);

const rooms: Map<string, Room> = new Map([
    ['room-1', { id: 'room-1', hotelId: 'hotel-1', title: 'Presidential Suite', description: 'The best room in the house.', price: 500, images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'], capacity: 2, status: 'approved', createdAt: new Date(), 'data-ai-hint': 'hotel room luxury' }],
    ['room-2', { id: 'room-2', hotelId: 'hotel-1', title: 'Deluxe Queen Room', description: 'Comfortable and elegant.', price: 250, images: ['https://placehold.co/600x400.png'], capacity: 2, status: 'approved', createdAt: new Date(), 'data-ai-hint': 'hotel room modern' }],
    ['room-3', { id: 'room-3', hotelId: 'hotel-2', title: 'Cozy Double', description: 'Awaiting approval for this cozy room.', price: 150, images: ['https://placehold.co/600x400.png'], capacity: 2, status: 'pending', createdAt: new Date(), 'data-ai-hint': 'hotel room cozy' }],
    ['room-4', { id: 'room-4', hotelId: 'hotel-3', title: 'City View King', description: 'Stunning views of the metropolis skyline.', price: 300, images: ['https://placehold.co/600x400.png'], capacity: 2, status: 'approved', createdAt: new Date(), 'data-ai-hint': 'hotel room city' }],
    ['room-5', { id: 'room-5', hotelId: 'hotel-1', title: 'Courtyard Twin', description: 'A peaceful room overlooking the garden courtyard.', price: 220, images: ['https://placehold.co/600x400.png'], capacity: 2, status: 'pending', createdAt: new Date(), 'data-ai-hint': 'hotel room garden' }],
    ['room-6', { id: 'room-6', hotelId: 'hotel-4', title: 'Alpine Loft', description: 'A room with a view of the peaks.', price: 350, images: ['https://placehold.co/600x400.png'], capacity: 3, status: 'approved', createdAt: new Date(), 'data-ai-hint': 'mountain view room' }],
    ['room-7', { id: 'room-7', hotelId: 'hotel-4', title: 'Chalet Suite', description: 'Rustic charm meets modern luxury.', price: 450, images: ['https://placehold.co/600x400.png'], capacity: 4, status: 'approved', createdAt: new Date(), 'data-ai-hint': 'chalet interior' }],
    ['room-8', { id: 'room-8', hotelId: 'hotel-5', title: 'Oasis Villa', description: 'Private villa with a plunge pool.', price: 600, images: ['https://placehold.co/600x400.png'], capacity: 2, status: 'pending', createdAt: new Date(), 'data-ai-hint': 'desert villa' }],
    ['room-9', { id: 'room-9', hotelId: 'hotel-6', title: 'Redwood Cabin', description: 'Sleep amongst the giants.', price: 280, images: ['https://placehold.co/600x400.png'], capacity: 4, status: 'approved', createdAt: new Date(), 'data-ai-hint': 'forest cabin' }],
    ['room-10', { id: 'room-10', hotelId: 'hotel-3', title: 'Studio Apartment', description: 'A home away from home in the city.', price: 180, images: ['https://placehold.co/600x400.png'], capacity: 2, status: 'approved', createdAt: new Date(), 'data-ai-hint': 'city apartment' }],
]);

const bookings: Map<string, Booking> = new Map([
    ['booking-1', { id: 'booking-1', userId: 'user-1', roomId: 'room-1', hotelId: 'hotel-1', fromDate: new Date('2024-08-10'), toDate: new Date('2024-08-15'), totalPrice: 2500, status: 'confirmed', createdAt: new Date() }],
    ['booking-2', { id: 'booking-2', userId: 'user-5', roomId: 'room-4', hotelId: 'hotel-3', fromDate: new Date('2024-09-01'), toDate: new Date('2024-09-05'), totalPrice: 1200, status: 'confirmed', createdAt: new Date() }],
    ['booking-3', { id: 'booking-3', userId: 'user-1', roomId: 'room-7', hotelId: 'hotel-4', fromDate: new Date('2024-10-20'), toDate: new Date('2024-10-25'), totalPrice: 2250, status: 'cancelled', createdAt: new Date() }],
    ['booking-4', { id: 'booking-4', userId: 'user-5', roomId: 'room-9', hotelId: 'hotel-6', fromDate: new Date('2024-11-11'), toDate: new Date('2024-11-18'), totalPrice: 1960, status: 'confirmed', createdAt: new Date() }],
]);

// API-like access patterns
export const getApprovedHotels = async (): Promise<Hotel[]> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return Array.from(hotels.values()).filter(h => h.status === 'approved');
};

export const getPendingHotels = async (): Promise<Hotel[]> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return Array.from(hotels.values()).filter(h => h.status === 'pending');
};

export const getPendingRooms = async (): Promise<Room[]> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return Array.from(rooms.values()).filter(r => r.status === 'pending');
};

export const getHotelById = async (id: string): Promise<Hotel | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    return hotels.get(id);
};

export const getRoomsByHotelId = async (hotelId: string): Promise<Room[]> => {
    await new Promise(resolve => setTimeout(resolve, 400)); // Simulate network delay
    return Array.from(rooms.values()).filter(r => r.hotelId === hotelId && r.status === 'approved');
};

export const getRoomById = async (id: string): Promise<Room | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    return rooms.get(id);
};

export const updateHotelStatus = async (id: string, status: 'approved' | 'rejected'): Promise<Hotel | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network action
    const hotel = hotels.get(id);
    if (hotel) {
        hotel.status = status;
        hotels.set(id, hotel);
    }
    return hotel;
}

export const createHotel = async (hotelData: NewHotel): Promise<Hotel> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network action
    const newHotel: Hotel = {
        id: `hotel-${Date.now()}`,
        ...hotelData,
        status: 'pending',
        coverImage: 'https://placehold.co/1200x800.png',
        createdAt: new Date(),
    };
    hotels.set(newHotel.id, newHotel);
    return newHotel;
}

export const updateRoomStatus = async (id: string, status: 'approved' | 'rejected'): Promise<Room | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network action
    const room = rooms.get(id);
    if(room) {
        room.status = status;
        rooms.set(id, room);
    }
    return room;
}