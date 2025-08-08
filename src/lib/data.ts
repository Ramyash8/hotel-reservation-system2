
import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, query, where, Timestamp, serverTimestamp } from 'firebase/firestore';
import type { User, Hotel, Room, Booking, NewHotel, NewUser, HotelSearchCriteria, NewRoom } from './types';

const usersCol = collection(db, 'users');
const hotelsCol = collection(db, 'hotels');
const roomsCol = collection(db, 'rooms');
const bookingsCol = collection(db, 'bookings');

// Helper to convert Firestore doc to our types
const fromFirestore = <T>(docSnap: any): T => {
    const data = docSnap.data();
    return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        // Convert other Timestamps if necessary
        fromDate: data.fromDate instanceof Timestamp ? data.fromDate.toDate() : undefined,
        toDate: data.toDate instanceof Timestamp ? data.toDate.toDate() : undefined,
    } as T;
};


// Auth functions
export const authenticateUser = async (email: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const q = query(usersCol, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }
    
    // NOTE: In a real app, you would compare hashed passwords.
    const userDoc = querySnapshot.docs[0];
    return fromFirestore<User>(userDoc);
}

export const createUser = async (userData: NewUser): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const q = query(usersCol, where("email", "==", userData.email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        throw new Error("User with this email already exists");
    }

    const newUserRef = await addDoc(usersCol, {
        ...userData,
        createdAt: serverTimestamp(),
    });

    const newUserSnap = await getDoc(newUserRef);
    return fromFirestore<User>(newUserSnap);
};

export const getUserById = async (id: string): Promise<User | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return fromFirestore<User>(docSnap);
    }
    return undefined;
};


// API-like access patterns
export const getApprovedHotels = async (): Promise<Hotel[]> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    const q = query(hotelsCol, where("status", "==", "approved"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => fromFirestore<Hotel>(doc));
};

export const searchHotels = async (criteria: HotelSearchCriteria): Promise<Hotel[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Firestore doesn't support case-insensitive "contains" queries natively.
    // For a real app, use a third-party search service like Algolia or a more complex query structure.
    // Here, we fetch all and filter client-side, which is not scalable.
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

export const getPendingHotels = async (): Promise<Hotel[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const q = query(hotelsCol, where("status", "==", "pending"));
    const snapshot = await getDocs(q);
    const pendingHotels = snapshot.docs.map(doc => fromFirestore<Hotel>(doc));
    
    // Enrich with owner info
    return Promise.all(pendingHotels.map(async hotel => {
        const owner = await getUserById(hotel.ownerId);
        return {
            ...hotel,
            ownerName: owner?.name || 'Unknown',
            ownerEmail: owner?.email || 'N/A'
        };
    }));
};


export const getPendingRooms = async (): Promise<Room[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const q = query(roomsCol, where("status", "==", "pending"));
    const snapshot = await getDocs(q);
    const pendingRooms = snapshot.docs.map(doc => fromFirestore<Room>(doc));

    return Promise.all(pendingRooms.map(async room => {
        const hotel = await getHotelById(room.hotelId);
        return {
            ...room,
            hotelName: hotel?.name || 'Unknown Hotel'
        };
    }));
};

export const getHotelById = async (id: string): Promise<Hotel | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    const docRef = doc(db, "hotels", id);
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()){
        return fromFirestore<Hotel>(docSnap);
    }
    return undefined;
};

export const getRoomsByHotelId = async (hotelId: string): Promise<Room[]> => {
    await new Promise(resolve => setTimeout(resolve, 400)); // Simulate network delay
    const q = query(roomsCol, where("hotelId", "==", hotelId), where("status", "==", "approved"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => fromFirestore<Room>(doc));
};

export const getRoomById = async (id: string): Promise<Room | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    const docRef = doc(db, "rooms", id);
    const docSnap = await getDoc(docRef);
     if(docSnap.exists()){
        return fromFirestore<Room>(docSnap);
    }
    return undefined;
};

export const updateHotelStatus = async (id: string, status: 'approved' | 'rejected'): Promise<Hotel | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network action
    const docRef = doc(db, "hotels", id);
    await updateDoc(docRef, { status });
    return getHotelById(id);
}

export const createHotel = async (hotelData: NewHotel): Promise<Hotel> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network action
    const newHotelRef = await addDoc(hotelsCol, {
        ...hotelData,
        status: 'pending',
        coverImage: 'https://placehold.co/1200x800.png',
        createdAt: serverTimestamp(),
    });
    const newHotelSnap = await getDoc(newHotelRef);
    return fromFirestore<Hotel>(newHotelSnap);
}

export const updateRoomStatus = async (id: string, status: 'approved' | 'rejected'): Promise<Room | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network action
    const docRef = doc(db, "rooms", id);
    await updateDoc(docRef, { status });
    return getRoomById(id);
}

export const getHotelsByOwner = async (ownerId: string): Promise<Hotel[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const q = query(hotelsCol, where("ownerId", "==", ownerId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => fromFirestore<Hotel>(doc));
}

export const getRoomsByOwner = async (ownerId: string): Promise<Room[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const ownerHotels = await getHotelsByOwner(ownerId);
    if (ownerHotels.length === 0) return [];
    
    const ownerHotelIds = ownerHotels.map(h => h.id);
    // Firestore 'in' query is limited to 30 elements. For a larger scale app, this would need a different approach.
    const q = query(roomsCol, where("hotelId", "in", ownerHotelIds));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => fromFirestore<Room>(doc));
}

export const createRoom = async (roomData: NewRoom): Promise<Room> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newRoomRef = await addDoc(roomsCol, {
        ...roomData,
        images: ['https://placehold.co/600x400.png'], // default image
        status: 'pending',
        createdAt: serverTimestamp(),
    });
    const newRoomSnap = await getDoc(newRoomRef);
    return fromFirestore<Room>(newRoomSnap);
}
