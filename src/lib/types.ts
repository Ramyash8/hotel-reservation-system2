export type User = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'owner' | 'admin';
  createdAt: Date;
};

export type Hotel = {
  id: string;
  name: string;
  location: string;
  description: string;
  ownerId: string;
  status: 'pending' | 'approved' | 'rejected';
  coverImage: string;
  createdAt: Date;
};

export type NewHotel = Omit<Hotel, 'id' | 'status' | 'coverImage' | 'createdAt'>;

export type Room = {
  id: string;
  title: string;
  hotelId: string;
  description: string;
  price: number;
  images: string[];
  capacity: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
};

export type Booking = {
  id: string;
  userId: string;
  roomId: string;
  hotelId: string;
  fromDate: Date;
  toDate: Date;
  totalPrice: number;
  status: 'confirmed' | 'cancelled';
  createdAt: Date;
};
