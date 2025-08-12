
import { Timestamp } from 'firebase/firestore';

export type User = {
  id: string;
  name: string;
  email: string;
  // In a real app, you would not store passwords in plaintext.
  // This is for demonstration purposes only.
  password?: string;
  role: 'user' | 'owner' | 'admin';
  createdAt: Date | Timestamp;
};

export type NewUser = Omit<User, 'id' | 'createdAt'>;

export type Hotel = {
  id: string;
  name: string;
  location: string;
  description: string;
  ownerId: string;
  status: 'pending' | 'approved' | 'rejected';
  coverImage: string;
  category?: 'Premium' | 'Eco-Friendly' | 'Ski Resort' | 'Historic' | 'Boutique';
  createdAt: Date | Timestamp;
  ownerName?: string; // For admin view
  ownerEmail?: string; // For admin view
  'data-ai-hint'?: string;
};

export type NewHotel = Omit<Hotel, 'id' | 'status' | 'coverImage' | 'createdAt'>;

export type HotelSearchCriteria = {
  destination?: string;
  dateRange?: { from: Date; to: Date };
  guests?: number;
}

export type Room = {
  id: string;
  title: string;
  hotelId: string;
  description: string;
  price: number;
  images: string[];
  capacity: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date | Timestamp;
  hotelName?: string; // For admin view
  'data-ai-hint'?: string;
};

export type NewRoom = Omit<Room, 'id' | 'status' | 'images' | 'createdAt' | 'hotelName' | 'data-ai-hint'>;

export type Booking = {
  id: string;
  userId: string;
  roomId: string;
  hotelId:string;
  fromDate: Date | Timestamp;
  toDate: Date | Timestamp;
  totalPrice: number;
  status: 'confirmed' | 'cancelled';
  createdAt: Date | Timestamp;
  // Denormalized data for easy display
  hotelName?: string;
  hotelLocation?: string;
  roomTitle?: string;
  coverImage?: string;
  userName?: string; // For owner view
  hotelOwnerId?: string; // For owner view filtering
};

export type NewBooking = Omit<Booking, 'id' | 'createdAt' | 'status'>
