
import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, query, where, Timestamp, serverTimestamp, orderBy, writeBatch } from 'firebase/firestore';
import type { User, Hotel, Room, Booking, NewHotel, NewUser, HotelSearchCriteria, NewRoom, NewBooking } from './types';
import { differenceInDays } from 'date-fns';

// Collection references
const usersCol = collection(db, "users");
const hotelsCol = collection(db, "hotels");
const roomsCol = collection(db, "rooms");
const bookingsCol = collection(db, "bookings");

// Helper to convert Firestore doc to our types, handling Timestamps
const fromFirestore = <T extends { id: string }>(docSnap: any): T => {
    if (!docSnap.exists()) {
        return undefined as any;
    }

    const data = docSnap.data();

    const result: { [key: string]: any } = {
        id: docSnap.id,
    };

    for (const key in data) {
        if (data[key] instanceof Timestamp) {
            result[key] = data[key].toDate();
        } else {
            result[key] = data[key];
        }
    }
    
    return result as T;
};

// --- Auth functions ---
export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
    try {
        const q = query(usersCol, where("email", "==", email), where("password", "==", password));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("No user found with that email/password combination in Firestore.");
            return null;
        }
        
        const userDoc = querySnapshot.docs[0];
        return fromFirestore<User>(userDoc);
    } catch (error) {
        console.error("Error during Firestore authentication:", error);
        return null;
    }
}

export const createUser = async (userData: NewUser): Promise<User> => {
    const q = query(usersCol, where("email", "==", userData.email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        throw new Error("User with this email already exists");
    }

    const docRef = await addDoc(usersCol, {
        ...userData,
        createdAt: serverTimestamp(),
    });

    const newUserDoc = await getDoc(docRef);
    return fromFirestore<User>(newUserDoc);
};

export const getUserById = async (id: string): Promise<User | undefined> => {
    try {
        const userDoc = await getDoc(doc(usersCol, id));
        return fromFirestore<User>(userDoc);
    } catch (error) {
        console.error("Error fetching user by ID from Firestore:", error);
        return undefined;
    }
};

// --- Hotel functions ---
export const getApprovedHotels = async (): Promise<Hotel[]> => {
    const q = query(hotelsCol, where('status', '==', 'approved'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => fromFirestore<Hotel>(doc));
};

export const searchHotels = async (criteria: HotelSearchCriteria): Promise<Hotel[]> => {
    const searchLower = criteria.destination?.toLowerCase();
    
    // For simplicity, we fetch all and filter client-side.
    // In a real-world app, you'd use more complex queries or a search service.
    const allHotels = await getApprovedHotels();

    if (!searchLower) {
        return allHotels;
    }

    return allHotels.filter(hotel =>
        hotel.name.toLowerCase().includes(searchLower) ||
        hotel.location.toLowerCase().includes(searchLower)
    );
};

export const getPendingHotels = async (): Promise<Hotel[]> => {
    const q = query(hotelsCol, where('status', '==', 'pending'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => fromFirestore<Hotel>(doc));
};

export const getHotelById = async (id: string): Promise<Hotel | undefined> => {
    const hotelDoc = await getDoc(doc(hotelsCol, id));
    return fromFirestore<Hotel>(hotelDoc);
};

export const getHotelsByOwner = async (ownerId: string): Promise<Hotel[]> => {
    const q = query(hotelsCol, where('ownerId', '==', ownerId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => fromFirestore<Hotel>(doc));
};

export const createHotel = async (hotelData: NewHotel): Promise<Hotel> => {
    const docRef = await addDoc(hotelsCol, {
        ...hotelData,
        status: 'pending',
        coverImage: 'https://placehold.co/1200x800.png',
        createdAt: serverTimestamp(),
    });
    const newHotelDoc = await getDoc(docRef);
    return fromFirestore<Hotel>(newHotelDoc);
};

export const updateHotelStatus = async (id: string, status: 'approved' | 'rejected'): Promise<void> => {
    await updateDoc(doc(hotelsCol, id), { status });
};

// --- Room functions ---
export const getPendingRooms = async (): Promise<Room[]> => {
    const q = query(roomsCol, where('status', '==', 'pending'));
    const snapshot = await getDocs(q);
    const rooms = snapshot.docs.map(doc => fromFirestore<Room>(doc));

    // Enrich rooms with hotel names
    for (const room of rooms) {
        const hotel = await getHotelById(room.hotelId);
        room.hotelName = hotel ? hotel.name : 'Unknown Hotel';
    }
    return rooms;
};

export const getRoomsByHotelId = async (hotelId: string): Promise<Room[]> => {
    const q = query(roomsCol, where('hotelId', '==', hotelId), where('status', '==', 'approved'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => fromFirestore<Room>(doc));
};

export const getRoomById = async (id: string): Promise<Room | undefined> => {
    const roomDoc = await getDoc(doc(roomsCol, id));
    return fromFirestore<Room>(roomDoc);
};

export const getRoomsByOwner = async (ownerId: string): Promise<Room[]> => {
    const ownerHotels = await getHotelsByOwner(ownerId);
    if (ownerHotels.length === 0) return [];

    const ownerHotelIds = ownerHotels.map(h => h.id);
    const q = query(roomsCol, where('hotelId', 'in', ownerHotelIds));
    const snapshot = await getDocs(q);
    const rooms = snapshot.docs.map(doc => fromFirestore<Room>(doc));

    // Enrich rooms with hotel names
    for (const room of rooms) {
        const hotel = ownerHotels.find(h => h.id === room.hotelId);
        room.hotelName = hotel ? hotel.name : 'Unknown Hotel';
    }
    return rooms;
}

export const createRoom = async (roomData: NewRoom): Promise<Room> => {
    const docRef = await addDoc(roomsCol, {
        ...roomData,
        images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x401.png', 'https://placehold.co/600x402.png'],
        status: 'pending',
        createdAt: serverTimestamp(),
    });
    const newRoomDoc = await getDoc(docRef);
    return fromFirestore<Room>(newRoomDoc);
}

export const updateRoomStatus = async (id: string, status: 'approved' | 'rejected'): Promise<void> => {
    await updateDoc(doc(roomsCol, id), { status });
};


// --- Booking Functions ---
export const createBooking = async (bookingData: NewBooking): Promise<Booking> => {
    // Basic validation
    if (!bookingData.fromDate || !bookingData.toDate || !bookingData.userId || !bookingData.roomId) {
        throw new Error("Missing required booking information.");
    }

    const room = await getRoomById(bookingData.roomId);
    if (!room) throw new Error("Room not found.");
    
    const hotel = await getHotelById(bookingData.hotelId);
    if (!hotel) throw new Error("Hotel not found.");
    
    const user = await getUserById(bookingData.userId);
    if (!user) throw new Error("User not found.");

    const fromDate = bookingData.fromDate instanceof Timestamp ? bookingData.fromDate.toDate() : bookingData.fromDate;
    const toDate = bookingData.toDate instanceof Timestamp ? bookingData.toDate.toDate() : bookingData.toDate;
    
    const numberOfNights = differenceInDays(toDate, fromDate);
    if (numberOfNights <= 0) {
        throw new Error("Booking must be for at least one night.");
    }
    
    const newBookingData = {
        ...bookingData,
        totalPrice: room.price * numberOfNights,
        status: 'confirmed' as const,
        createdAt: serverTimestamp(),
        // Denormalized data
        hotelName: hotel.name,
        hotelLocation: hotel.location,
        roomTitle: room.title,
        coverImage: hotel.coverImage,
        userName: user.name,
        hotelOwnerId: hotel.ownerId,
    };
    
    const docRef = await addDoc(bookingsCol, newBookingData);
    const newBookingDoc = await getDoc(docRef);
    return fromFirestore<Booking>(newBookingDoc);
};

export const getBookingsByUser = async (userId: string): Promise<Booking[]> => {
    const q = query(bookingsCol, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => fromFirestore<Booking>(doc));
};

export const getBookingsByOwner = async (ownerId: string): Promise<Booking[]> => {
    const q = query(bookingsCol, where('hotelOwnerId', '==', ownerId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => fromFirestore<Booking>(doc));
};

export const getAllBookings = async (): Promise<Booking[]> => {
    const q = query(bookingsCol);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => fromFirestore<Booking>(doc));
};
