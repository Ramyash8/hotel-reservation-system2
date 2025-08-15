
import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, query, where, Timestamp, serverTimestamp, writeBatch, documentId } from 'firebase/firestore';
import type { User, Hotel, Room, Booking, NewHotel, NewUser, HotelSearchCriteria, NewRoom, NewBooking } from './types';
import { differenceInDays } from 'date-fns';

// Hardcoded sample data for initial auth/login before Firestore is fully hydrated.
const sampleUsers: User[] = [
    { id: 'user-1', name: 'Alice Owner', email: 'alice@example.com', role: 'owner', password: 'password', createdAt: new Date() },
    { id: 'user-2', name: 'Bob Guest', email: 'bob@example.com', role: 'user', password: 'password', createdAt: new Date() },
    { id: 'admin-user', name: 'Admin', email: 'admin@lodgify.lite', role: 'admin', password: 'adminpassword', createdAt: new Date() },
];

const sampleRooms: Room[] = [
    {
        id: 'room-1',
        hotelId: 'hotel-1',
        title: 'Presidential Suite',
        description: 'A suite fit for royalty with panoramic city views.',
        price: 950,
        capacity: 4,
        images: ['https://cf.bstatic.com/xdata/images/hotel/max1024x768/528344237.jpg?k=3f2739e44485775317b96e5dc059e356d4608c887082987113c14856f68c16d0&o=', 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/528344242.jpg?k=7f88a9134a6a0537c3a8c51a704e622b3974a68a52932a39a888c03c53e6a4a4&o=', 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/528344246.jpg?k=b4e637ba235c8734ef98a3064eac7a7b8e19c3b8ca7026df1f2f115a3059296e&o='],
        status: 'approved',
        createdAt: new Date()
    },
    {
        id: 'room-2',
        hotelId: 'hotel-2',
        title: 'Caldera View Room',
        description: 'Wake up to the iconic view of the Santorini caldera.',
        price: 450,
        capacity: 2,
        images: ['https://cf.bstatic.com/xdata/images/hotel/max1024x768/480530682.jpg?k=c23ad2a586718c20fc003eb1d3363560b9d13567291fc4d78d6f72a6a3aeb58c&o=','https://cf.bstatic.com/xdata/images/hotel/max1024x768/678234747.jpg?k=418b38f7b6ec6ee9eb5104e26350bf1df490141b18f063f6ca4462f89dc42e1f&o=','https://cf.bstatic.com/xdata/images/hotel/max1024x768/678234748.jpg?k=8fcacdc49bfec35238f96871e0668fbad3eff62f51779b051b070e8e8d778fcc&o='],
        status: 'approved',
        createdAt: new Date()
    },
     {
        id: 'room-3',
        hotelId: 'hotel-3',
        title: 'Executive Room',
        description: 'Modern comforts and a workspace for the discerning traveler.',
        price: 250,
        capacity: 2,
        images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x401.png', 'https://placehold.co/600x402.png'],
        status: 'approved',
        createdAt: new Date()
    }
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

    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
             if (data[key] instanceof Timestamp) {
                result[key] = data[key].toDate();
            } else {
                result[key] = data[key];
            }
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

    const newUserDoc = await addDoc(usersCol, { ...userData, createdAt: serverTimestamp() });

    return {
      id: newUserDoc.id,
      ...userData,
      createdAt: new Date(),
    };
};

export const getUserById = async (id: string): Promise<User | undefined> => {
    const memoryUser = sampleUsers.find(u => u.id === id);
    if(memoryUser) return memoryUser;

    try {
        const userDoc = await getDoc(doc(usersCol, id));
        return fromFirestore<User>(userDoc);
    } catch (error) {
        console.error("Error fetching user by ID from Firestore:", error);
        return undefined;
    }
};


// API-like access patterns
export const getApprovedHotels = async (): Promise<Hotel[]> => {
    const q = query(hotelsCol, where('status', '==', 'approved'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => fromFirestore<Hotel>(doc)).filter(Boolean) as Hotel[];
};

export const searchHotels = async (criteria: HotelSearchCriteria): Promise<Hotel[]> => {
    const allApproved = await getApprovedHotels();
    if (!criteria.destination) {
        return allApproved;
    }

    const searchLower = criteria.destination.toLowerCase();
    return allApproved.filter(hotel =>
        (hotel.name.toLowerCase().includes(searchLower) ||
        hotel.location.toLowerCase().includes(searchLower))
    );
};

export const getHotelById = async (id: string): Promise<Hotel | undefined> => {
    const hotelDoc = await getDoc(doc(hotelsCol, id));
    return fromFirestore<Hotel>(hotelDoc);
};

export const getRoomsByHotelId = async (hotelId: string): Promise<Room[]> => {
    // This still uses sampleRooms for simplicity, could be moved to Firestore as well.
    return sampleRooms.filter(r => r.hotelId === hotelId && r.status === 'approved');
};

export const getRoomById = async (id: string): Promise<Room | undefined> => {
    return sampleRooms.find(r => r.id === id);
};

export const updateHotelStatus = async (id: string, status: 'approved' | 'rejected'): Promise<void> => {
    const hotelRef = doc(hotelsCol, id);
    await updateDoc(hotelRef, { status });
    console.log(`Updated hotel ${id} to ${status} in Firestore.`);
}

export const createHotel = async (hotelData: NewHotel): Promise<Hotel> => {
    const hotelWithTimestamp = {
        ...hotelData,
        status: 'pending' as const,
        coverImage: 'https://placehold.co/1200x800.png',
        createdAt: serverTimestamp(),
    };
    const newDocRef = await addDoc(hotelsCol, hotelWithTimestamp);
    
    return {
        id: newDocRef.id,
        ...hotelData,
        status: 'pending',
        coverImage: 'https://placehold.co/1200x800.png',
        createdAt: new Date(),
    }
}

export const updateRoomStatus = async (id: string, status: 'approved' | 'rejected'): Promise<void> => {
    const room = sampleRooms.find(r => r.id === id);
    if(room) {
        room.status = status;
    }
    console.log(`Updated room ${id} to ${status}. (In-memory)`);
}

export const getHotelsByOwner = async (ownerId: string): Promise<Hotel[]> => {
    const q = query(hotelsCol, where('ownerId', '==', ownerId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => fromFirestore<Hotel>(doc)).filter(Boolean) as Hotel[];
}

export const getRoomsByOwner = async (ownerId: string): Promise<Room[]> => {
    const ownerHotelIds = (await getHotelsByOwner(ownerId)).map(h => h.id);
    if (ownerHotelIds.length === 0) return [];
    
    // This still uses sampleRooms. A full implementation would query a 'rooms' collection.
    return sampleRooms.filter(r => ownerHotelIds.includes(r.hotelId)).map(room => {
        const hotel = sampleRooms.find(h => h.id === room.hotelId);
        return {
            ...room,
            hotelName: hotel ? hotel.title : 'Unknown Hotel'
        }
    });
}

export const createRoom = async (roomData: NewRoom): Promise<Room> => {
     const newRoom: Room = {
        id: `room-${sampleRooms.length + 1}`,
        ...roomData,
        images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x401.png', 'https://placehold.co/600x402.png'],
        status: 'pending',
        createdAt: new Date(),
    };
    sampleRooms.push(newRoom);
    return newRoom;
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
    
    const newBookingData = {
        ...bookingData,
        totalPrice: room.price * numberOfNights,
        status: 'confirmed' as const,
        createdAt: serverTimestamp(),
        hotelName: hotel.name,
        hotelLocation: hotel.location,
        roomTitle: room.title,
        coverImage: hotel.coverImage,
        userName: user.name,
        hotelOwnerId: hotel.ownerId,
    };
    
    const docRef = await addDoc(bookingsCol, newBookingData);
    console.log("New booking created in Firestore:", docRef.id);
    
    return {
        id: docRef.id,
        ...bookingData,
        totalPrice: room.price * numberOfNights,
        status: 'confirmed',
        createdAt: new Date(),
        hotelName: hotel.name,
        hotelLocation: hotel.location,
        roomTitle: room.title,
        coverImage: hotel.coverImage,
        userName: user.name,
        hotelOwnerId: hotel.ownerId,
    };
};

export const getBookingsByUser = async (userId: string): Promise<Booking[]> => {
    const q = query(bookingsCol, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => fromFirestore<Booking>(doc)).filter(Boolean) as Booking[];
}

export const getBookingsByOwner = async (ownerId: string): Promise<Booking[]> => {
    const q = query(bookingsCol, where('hotelOwnerId', '==', ownerId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => fromFirestore<Booking>(doc)).filter(Boolean) as Booking[];
}
