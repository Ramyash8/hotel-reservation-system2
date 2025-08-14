

import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, query, where, Timestamp, serverTimestamp } from 'firebase/firestore';
import type { User, Hotel, Room, Booking, NewHotel, NewUser, HotelSearchCriteria, NewRoom, NewBooking } from './types';
import { differenceInDays } from 'date-fns';

// Hardcoded sample data for initial users
const sampleUsers: User[] = [
    { id: 'user-1', name: 'Alice Owner', email: 'alice@example.com', role: 'owner', password: 'password', createdAt: new Date() },
    { id: 'user-2', name: 'Bob Guest', email: 'bob@example.com', role: 'user', password: 'password', createdAt: new Date() },
    { id: 'admin-user', name: 'Admin', email: 'admin@lodgify.lite', role: 'admin', password: 'adminpassword', createdAt: new Date() },
];

const sampleBookings: Booking[] = [];


// Collection references
const usersCol = collection(db, "users");
const hotelsCol = collection(db, "hotels");
const roomsCol = collection(db, "rooms");
const bookingsCol = collection(db, "bookings");

// Helper to convert Firestore doc to our types, now correctly handling Timestamps
const fromFirestore = <T extends { id: string }>(docSnap: any): T | undefined => {
    if (!docSnap.exists()) {
        return undefined;
    }

    const data = docSnap.data();
    if (!data) return undefined;

    const result: { [key: string]: any } = {
        id: docSnap.id,
    };

    // Manually map fields to ensure correct typing and timestamp conversion
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key) && data[key] instanceof Timestamp) {
            result[key] = data[key].toDate();
        } else {
            result[key] = data[key];
        }
    }
    
    return result as T;
};


// Auth functions
export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
    // Check in-memory users first (includes newly signed up users)
    const memoryUser = sampleUsers.find(u => u.email === email && u.password === password);
    if (memoryUser) {
        console.log("Authenticated via in-memory user data.");
        return memoryUser;
    }

    // Fallback to Firestore for persistent users (if any)
    try {
        const q = query(usersCol, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("No user found with that email in Firestore.");
            return null;
        }
        
        const userDoc = querySnapshot.docs[0];
        const dbUser = fromFirestore<User>(userDoc);

        if (dbUser && dbUser.password === password) {
            console.log("Authenticated via Firestore.");
            return dbUser;
        }
        
        console.log("Password does not match or user data is invalid.");
        return null;
    } catch (error) {
        console.error("Error during Firestore authentication:", error);
        return null;
    }
}

export const createUser = async (userData: NewUser): Promise<User> => {
    const q = query(usersCol, where("email", "==", userData.email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty || sampleUsers.find(u => u.email === userData.email)) {
        throw new Error("User with this email already exists");
    }

    // For demo purposes, we'll add to in-memory array and Firestore
    const docRef = await addDoc(usersCol, {
        ...userData,
        createdAt: serverTimestamp(),
    });

    const newUser: User = {
      id: docRef.id,
      ...userData,
      createdAt: new Date(),
    };
    sampleUsers.push(newUser);
    return newUser;
};

export const getUserById = async (id: string): Promise<User | undefined> => {
    const user = sampleUsers.find(u => u.id === id);
    if (user) {
        return user;
    }
    try {
        const userDoc = await getDoc(doc(usersCol, id));
        return fromFirestore<User>(userDoc);
    } catch (error) {
        console.error("Error fetching user by ID from Firestore:", error);
        return undefined;
    }
};


// Hotel Functions
export const getApprovedHotels = async (): Promise<Hotel[]> => {
    const q = query(hotelsCol, where("status", "==", "approved"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => fromFirestore<Hotel>(doc)).filter(Boolean) as Hotel[];
};

export const searchHotels = async (criteria: HotelSearchCriteria): Promise<Hotel[]> => {
    // This is a simplified search. A real app would use a dedicated search service like Algolia.
    const allApprovedHotels = await getApprovedHotels();
    if (!criteria.destination) {
        return allApprovedHotels;
    }

    const searchLower = criteria.destination.toLowerCase();
    return allApprovedHotels.filter(hotel =>
        hotel.name.toLowerCase().includes(searchLower) ||
        hotel.location.toLowerCase().includes(searchLower)
    );
};


export const getHotelById = async (id: string): Promise<Hotel | undefined> => {
    const hotelDoc = await getDoc(doc(hotelsCol, id));
    return fromFirestore<Hotel>(hotelDoc);
};

export const createHotel = async (hotelData: NewHotel): Promise<Hotel> => {
    const newHotelData = {
        ...hotelData,
        status: 'pending' as const,
        coverImage: 'https://placehold.co/1200x800.png',
        createdAt: serverTimestamp(),
    }
    const docRef = await addDoc(hotelsCol, newHotelData);
    
    return {
        id: docRef.id,
        ...hotelData,
        status: 'pending',
        coverImage: 'https://placehold.co/1200x800.png',
        createdAt: new Date(), // Return a Date object for immediate use
    };
}

export const updateHotelStatus = async (id: string, status: 'approved' | 'rejected'): Promise<void> => {
    const hotelRef = doc(hotelsCol, id);
    await updateDoc(hotelRef, { status });
    console.log(`Updated hotel ${id} to ${status} in Firestore.`);
}

export const getHotelsByOwner = async (ownerId: string): Promise<Hotel[]> => {
    const q = query(hotelsCol, where("ownerId", "==", ownerId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => fromFirestore<Hotel>(doc)).filter(Boolean) as Hotel[];
}

// Room Functions
export const getRoomsByHotelId = async (hotelId: string): Promise<Room[]> => {
    const q = query(roomsCol, where("hotelId", "==", hotelId), where("status", "==", "approved"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => fromFirestore<Room>(doc)).filter(Boolean) as Room[];
};

export const getRoomById = async (id: string): Promise<Room | undefined> => {
    const roomDoc = await getDoc(doc(roomsCol, id));
    return fromFirestore<Room>(roomDoc);
};

export const createRoom = async (roomData: NewRoom): Promise<Room> => {
     const newRoomData = {
        ...roomData,
        images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x401.png', 'https://placehold.co/600x402.png'],
        status: 'pending' as const,
        createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(roomsCol, newRoomData);
    return {
        id: docRef.id,
        ...roomData,
        images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x401.png', 'https://placehold.co/600x402.png'],
        status: 'pending',
        createdAt: new Date(),
    };
}

export const updateRoomStatus = async (id: string, status: 'approved' | 'rejected'): Promise<void> => {
    const roomRef = doc(roomsCol, id);
    await updateDoc(roomRef, { status });
    console.log(`Updated room ${id} to ${status} in Firestore.`);
}

export const getRoomsByOwner = async (ownerId: string): Promise<Room[]> => {
    const ownerHotels = await getHotelsByOwner(ownerId);
    const ownerHotelIds = ownerHotels.map(h => h.id);

    if (ownerHotelIds.length === 0) {
        return [];
    }
    
    // Firestore 'in' query is limited to 30 elements in the array.
    // For a larger number of hotels, you might need multiple queries.
    const q = query(roomsCol, where("hotelId", "in", ownerHotelIds));
    const snapshot = await getDocs(q);
    const rooms = snapshot.docs.map(doc => fromFirestore<Room>(doc)).filter(Boolean) as Room[];
    
    return rooms.map(room => {
        const hotel = ownerHotels.find(h => h.id === room.hotelId);
        return {
            ...room,
            hotelName: hotel ? hotel.name : 'Unknown Hotel'
        }
    });
}


// Booking Functions
export const createBooking = async (bookingData: NewBooking): Promise<Booking> => {
    const from = bookingData.fromDate instanceof Timestamp ? bookingData.fromDate.toDate() : bookingData.fromDate;
    const to = bookingData.toDate instanceof Timestamp ? bookingData.toDate.toDate() : bookingData.toDate;

    if (!from || !to || !bookingData.userId || !bookingData.roomId) {
        throw new Error("Missing required booking information.");
    }
    
    const room = await getRoomById(bookingData.roomId);
    if (!room) throw new Error("Room not found.");
    
    const hotel = await getHotelById(bookingData.hotelId);
    if (!hotel) throw new Error("Hotel not found.");
    
    const user = await getUserById(bookingData.userId);
    if (!user) throw new Error("User not found.");

    const numberOfNights = differenceInDays(to, from);
    if (numberOfNights <= 0) {
        throw new Error("Booking must be for at least one night.");
    }
    
    const newBookingData: Omit<Booking, 'id' | 'createdAt'> = {
        ...bookingData,
        totalPrice: room.price * numberOfNights,
        status: 'confirmed',
        hotelName: hotel.name,
        hotelLocation: hotel.location,
        roomTitle: room.title,
        coverImage: hotel.coverImage,
        userName: user.name,
        hotelOwnerId: hotel.ownerId,
    };

    const docRef = await addDoc(bookingsCol, {
        ...newBookingData,
        createdAt: serverTimestamp(),
    });

    const newBooking: Booking = {
        id: docRef.id,
        ...newBookingData,
        createdAt: new Date(),
    };
    
    sampleBookings.push(newBooking); // Also keep in-memory for demo if needed
    console.log("New booking created:", newBooking);
    return newBooking;
};

export const getBookingsByUser = async (userId: string): Promise<Booking[]> => {
    const q = query(bookingsCol, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    const bookings = snapshot.docs.map(doc => fromFirestore<Booking>(doc)).filter(Boolean) as Booking[];
    return bookings.sort((a,b) => (b.createdAt as Date).getTime() - (a.createdAt as Date).getTime());
}

export const getBookingsByOwner = async (ownerId: string): Promise<Booking[]> => {
    const q = query(bookingsCol, where("hotelOwnerId", "==", ownerId));
    const snapshot = await getDocs(q);
    const bookings = snapshot.docs.map(doc => fromFirestore<Booking>(doc)).filter(Boolean) as Booking[];
    return bookings.sort((a,b) => (b.createdAt as Date).getTime() - (a.createdAt as Date).getTime());
}

export const getAllBookings = async (): Promise<Booking[]> => {
    const snapshot = await getDocs(bookingsCol);
    const bookings = snapshot.docs.map(doc => fromFirestore<Booking>(doc)).filter(Boolean) as Booking[];
    return bookings.sort((a, b) => (b.createdAt as Date).getTime() - (a.createdAt as Date).getTime());
}
