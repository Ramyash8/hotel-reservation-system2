
import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, query, where, Timestamp, serverTimestamp } from 'firebase/firestore';
import type { User, Hotel, Room, Booking, NewHotel, NewUser, HotelSearchCriteria, NewRoom, NewBooking } from './types';
import { differenceInDays } from 'date-fns';

// Hardcoded sample data
const sampleUsers: User[] = [
    { id: 'user-1', name: 'Alice Owner', email: 'alice@example.com', role: 'owner', password: 'password', createdAt: new Date() },
    { id: 'user-2', name: 'Bob Guest', email: 'bob@example.com', role: 'user', password: 'password', createdAt: new Date() },
    { id: 'admin-user', name: 'Admin', email: 'admin@lodgify.lite', role: 'admin', password: 'adminpassword', createdAt: new Date() },
];


const sampleHotels: Hotel[] = [
    {
        id: 'hotel-1',
        name: 'The Grand Palace',
        location: 'Istanbul, Turkey',
        description: 'Experience unparalleled luxury and breathtaking views of the Bosphorus in our five-star hotel, where elegance meets comfort.',
        address: '123 Bosphorus Street, Istanbul, Turkey',
        phone: '+90 212 555 1234',
        email: 'reservations@grandpalace.com',
        website: 'https://grandpalace.com',
        ownerId: 'user-1',
        ownerName: 'Alice Owner',
        ownerEmail: 'alice@example.com',
        status: 'approved',
        coverImage: 'https://cf.bstatic.com/static/img/theme-index/bg_luxury/869918c9da63b2c5685fce05965700da5b0e6617.jpg',
        category: 'Premium',
        createdAt: new Date(),
        'data-ai-hint': 'luxury hotel interior'
    },
    {
        id: 'hotel-2',
        name: 'Santorini Seaside Escape',
        location: 'Oia, Greece',
        description: 'Nestled on the cliffs of Oia, our hotel offers stunning sunsets and direct access to the azure waters of the Aegean Sea.',
        address: '456 Caldera View, Oia, Greece',
        phone: '+30 22860 71234',
        email: 'info@santoriniescape.com',
        website: 'https://santoriniescape.com',
        ownerId: 'user-1',
        ownerName: 'Alice Owner',
        ownerEmail: 'alice@example.com',
        status: 'approved',
        coverImage: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/678234743.jpg?k=acee705a06f3347cd2f3d53609a536b772a99eda3603c4eb5ef136e5e6cd6204&o=',
        category: 'Boutique',
        createdAt: new Date(),
        'data-ai-hint': 'santorini hotel'
    },
    {
        id: 'hotel-3',
        name: 'Modern City Hub',
        location: 'Ankara, Turkey',
        description: 'A stylish and contemporary hotel in the heart of the city, perfect for business travelers and urban explorers.',
        address: '789 Ataturk Boulevard, Ankara, Turkey',
        phone: '+90 312 555 5678',
        email: 'contact@cityhubankara.com',
        website: 'https://cityhubankara.com',
        ownerId: 'user-1',
        ownerName: 'Alice Owner',
        ownerEmail: 'alice@example.com',
        status: 'approved',
        coverImage: 'https://lux-life.digital/wp-content/uploads/2019/09/turkish-hotel.jpg',
        category: 'Boutique',
        createdAt: new Date(),
        'data-ai-hint': 'modern hotel room'
    }
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

// Helper to convert Firestore doc to our types, now correctly handling Timestamps
const fromFirestore = <T>(docSnap: any): T => {
    if (!docSnap.exists()) {
        return undefined as T;
    }

    const data = docSnap.data();

    const result: { [key: string]: any } = {
        id: docSnap.id,
    };

    // Manually map fields to ensure correct typing and timestamp conversion
    for (const key in data) {
        if (data[key] instanceof Timestamp) {
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

    const newUser: User = {
      id: `user-${Date.now()}`, // Use a more unique ID
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
    // Fallback to check Firestore if not in-memory
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
    return sampleHotels.filter(h => h.status === 'approved');
};

export const searchHotels = async (criteria: HotelSearchCriteria): Promise<Hotel[]> => {
    if (!criteria.destination) {
        return sampleHotels.filter(h => h.status === 'approved');
    }

    const searchLower = criteria.destination.toLowerCase();
    return sampleHotels.filter(hotel =>
        (hotel.name.toLowerCase().includes(searchLower) ||
        hotel.location.toLowerCase().includes(searchLower)) && hotel.status === 'approved'
    );
};

export const getPendingHotels = async (): Promise<Hotel[]> => {
    return sampleHotels.filter(h => h.status === 'pending');
};


export const getPendingRooms = async (): Promise<Room[]> => {
     return sampleRooms.filter(r => r.status === 'pending').map(room => {
        const hotel = sampleHotels.find(h => h.id === room.hotelId);
        return {
            ...room,
            hotelName: hotel ? hotel.name : 'Unknown Hotel'
        }
    });
};

export const getHotelById = async (id: string): Promise<Hotel | undefined> => {
    return sampleHotels.find(h => h.id === id);
};

export const getRoomsByHotelId = async (hotelId: string): Promise<Room[]> => {
    return sampleRooms.filter(r => r.hotelId === hotelId && r.status === 'approved');
};

export const getRoomById = async (id: string): Promise<Room | undefined> => {
    return sampleRooms.find(r => r.id === id);
};

export const updateHotelStatus = async (id: string, status: 'approved' | 'rejected'): Promise<void> => {
    const hotel = sampleHotels.find(h => h.id === id);
    if(hotel) {
        hotel.status = status;
    }
    console.log(`Updated hotel ${id} to ${status}. (In-memory)`);
}

export const createHotel = async (hotelData: NewHotel): Promise<Hotel> => {
    const newHotel: Hotel = {
        id: `hotel-${sampleHotels.length + 1}`,
        ...hotelData,
        status: 'pending',
        coverImage: 'https://placehold.co/1200x800.png',
        createdAt: new Date(),
    }
    sampleHotels.push(newHotel);
    return newHotel;
}

export const updateRoomStatus = async (id: string, status: 'approved' | 'rejected'): Promise<void> => {
    const room = sampleRooms.find(r => r.id === id);
    if(room) {
        room.status = status;
    }
    console.log(`Updated room ${id} to ${status}. (In-memory)`);
}

export const getHotelsByOwner = async (ownerId: string): Promise<Hotel[]> => {
    return sampleHotels.filter(h => h.ownerId === ownerId);
}

export const getRoomsByOwner = async (ownerId: string): Promise<Room[]> => {
    const ownerHotelIds = sampleHotels.filter(h => h.ownerId === ownerId).map(h => h.id);
    return sampleRooms.filter(r => ownerHotelIds.includes(r.hotelId)).map(room => {
        const hotel = sampleHotels.find(h => h.id === room.hotelId);
        return {
            ...room,
            hotelName: hotel ? hotel.name : 'Unknown Hotel'
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

    // Basic validation
    if (!from || !to || !bookingData.userId || !bookingData.roomId) {
        throw new Error("Missing required booking information.");
    }
    
    // In a real app, you'd check for overlapping bookings here.
    // For this demo, we'll just assume the booking is always possible.

    const room = await getRoomById(bookingData.roomId);
    if (!room) {
        throw new Error("Room not found.");
    }
    const hotel = await getHotelById(bookingData.hotelId);
     if (!hotel) {
        throw new Error("Hotel not found.");
    }
    const user = await getUserById(bookingData.userId);
    if (!user) {
        throw new Error("User not found.");
    }

    const numberOfNights = differenceInDays(to, from);
    if (numberOfNights <= 0) {
        throw new Error("Booking must be for at least one night.");
    }
    
    const newBooking: Booking = {
        id: `booking-${sampleBookings.length + 1}`,
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
    
    sampleBookings.push(newBooking);
    console.log("New booking created:", newBooking);
    return newBooking;
};

export const getBookingsByUser = async (userId: string): Promise<Booking[]> => {
    return sampleBookings.filter(b => b.userId === userId).sort((a,b) => (b.createdAt as Date).getTime() - (a.createdAt as Date).getTime());
}

export const getBookingsByOwner = async (ownerId: string): Promise<Booking[]> => {
    return sampleBookings
        .filter(b => b.hotelOwnerId === ownerId)
        .sort((a,b) => (b.createdAt as Date).getTime() - (a.createdAt as Date).getTime());
}

export const getAllBookings = async (): Promise<Booking[]> => {
    // In a real app this would likely have pagination
    return [...sampleBookings].sort((a, b) => (b.createdAt as Date).getTime() - (a.createdAt as Date).getTime());
}
