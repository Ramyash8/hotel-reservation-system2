
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, getDocs, addDoc, serverTimestamp, writeBatch, doc } from 'firebase/firestore';
import type { NewHotel, NewUser, NewRoom } from './types';


const firebaseConfig = {
  "projectId": "lodgify-lite-xhtha",
  "appId": "1:720826776932:web:cc195257ff975f49788e71",
  "storageBucket": "lodgify-lite-xhtha.firebasestorage.app",
  "apiKey": "AIzaSyADLyfG_gE4mtrE04Sm2Zpx5Nld1fMRG8Y",
  "authDomain": "lodgify-lite-xhtha.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "720826776932"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// --- Sample Data ---
const sampleUsersData: NewUser[] = [
    { name: 'Alice Owner', email: 'alice@example.com', password: 'password', role: 'owner' },
    { name: 'Bob Guest', email: 'bob@example.com', password: 'password', role: 'user' },
    { name: 'Admin User', email: 'admin@lodgify.lite', password: 'adminpassword', role: 'admin' },
];

const sampleHotelsData: Omit<NewHotel, 'ownerId' | 'ownerName' | 'ownerEmail' | 'createdAt'>[] = [
    {
        name: 'The Grand Palace',
        location: 'Istanbul, Turkey',
        description: 'Experience unparalleled luxury and breathtaking views of the Bosphorus in our five-star hotel, where elegance meets comfort.',
        address: "1 Bosphorus St, Istanbul, Turkey",
        phone: "555-123-4567",
        email: "contact@grandpalace.com",
        website: "https://grandpalace.com",
        facilities: ["wifi", "pool", "spa"],
        checkInTime: "15:00",
        checkOutTime: "12:00",
        cancellationPolicy: "Full refund for cancellations made 48 hours in advance.",
        isPetFriendly: true,
        documents: [],
        status: 'approved',
        coverImage: 'https://cf.bstatic.com/static/img/theme-index/bg_luxury/869918c9da63b2c5685fce05965700da5b0e6617.jpg',
        category: 'Premium',
        'data-ai-hint': 'luxury hotel interior'
    },
    {
        name: 'Santorini Seaside Escape',
        location: 'Oia, Greece',
        description: 'Nestled on the cliffs of Oia, our hotel offers stunning sunsets and direct access to the azure waters of the Aegean Sea.',
        address: "1 Cliffside Rd, Oia, Greece",
        phone: "555-987-6543",
        email: "reservations@santoriniescape.com",
        website: "https://santoriniescape.com",
        facilities: ["wifi", "pool"],
        checkInTime: "14:00",
        checkOutTime: "11:00",
        cancellationPolicy: "Full refund for cancellations made 7 days in advance.",
        isPetFriendly: false,
        documents: [],
        status: 'approved',
        coverImage: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/678234743.jpg?k=acee705a06f3347cd2f3d53609a536b772a99eda3603c4eb5ef136e5e6cd6204&o=',
        category: 'Boutique',
        'data-ai-hint': 'santorini hotel'
    },
    {
        name: 'Modern City Hub',
        location: 'Ankara, Turkey',
        description: 'A stylish and contemporary hotel in the heart of the city, perfect for business travelers and urban explorers.',
        address: "123 Capital Ave, Ankara, Turkey",
        phone: "555-234-5678",
        email: "info@modernhub.com",
        website: "https://modernhub.com",
        facilities: ["wifi", "gym", "restaurant"],
        checkInTime: "15:00",
        checkOutTime: "12:00",
        cancellationPolicy: "Flexible cancellation up to 24 hours before check-in.",
        isPetFriendly: false,
        documents: [],
        status: 'approved',
        coverImage: 'https://lux-life.digital/wp-content/uploads/2019/09/turkish-hotel.jpg',
        category: 'Boutique',
        'data-ai-hint': 'modern hotel room'
    }
];

const sampleRoomsData: Omit<NewRoom, 'hotelId' | 'createdAt'>[] = [
    {
        title: 'Presidential Suite',
        description: 'A suite fit for royalty with panoramic city views.',
        price: 950,
        capacity: 4,
    },
    {
        title: 'Caldera View Room',
        description: 'Wake up to the iconic view of the Santorini caldera.',
        price: 450,
        capacity: 2,
    },
     {
        title: 'Executive Room',
        description: 'Modern comforts and a workspace for the discerning traveler.',
        price: 250,
        capacity: 2,
    }
];


// --- Seeding Functions ---
const seedCollection = async <T extends { email?: string }>(collectionName: string, data: T[], uniqueField: keyof T & string = 'email') => {
    const collectionRef = collection(db, collectionName);
    console.log(`Checking if ${collectionName} collection needs seeding...`);

    const existingDocsSnapshot = await getDocs(query(collectionRef));
    const existingData = new Set(existingDocsSnapshot.docs.map(doc => doc.data()[uniqueField]));
    
    const newData = data.filter(item => !existingData.has(item[uniqueField]));

    if (newData.length === 0) {
        console.log(`${collectionName} collection is already up to date. Seeding skipped.`);
        return;
    }

    console.log(`Seeding ${newData.length} new documents into ${collectionName}...`);
    const batch = writeBatch(db);

    for (const item of newData) {
        const newDocRef = doc(collectionRef);
        batch.set(newDocRef, { ...item, createdAt: serverTimestamp() });
    }

    await batch.commit();
    console.log(`${newData.length} documents seeded into ${collectionName}.`);
};

const seedDatabase = async () => {
    try {
        await seedCollection<NewUser>('users', sampleUsersData, 'email');

        const usersSnapshot = await getDocs(collection(db, 'users'));
        const users = usersSnapshot.docs.map(doc => ({ ...doc.data() as NewUser, id: doc.id }));
        const owner = users.find(u => u.role === 'owner');

        if (owner) {
            const hotelsSnapshot = await getDocs(collection(db, 'hotels'));
            const existingHotelNames = new Set(hotelsSnapshot.docs.map(doc => doc.data().name));
            
            const newHotelsData = sampleHotelsData
                .filter(hotel => !existingHotelNames.has(hotel.name))
                .map(hotel => ({
                    ...hotel,
                    ownerId: owner.id,
                    ownerName: owner.name,
                    ownerEmail: owner.email,
                }));
            
            if (newHotelsData.length > 0) {
                await seedCollection<Omit<NewHotel, 'createdAt'>>('hotels', newHotelsData, 'name');
            } else {
                 console.log('Hotels collection is already up to date.');
            }

            // Seed rooms for the newly added hotels
            const allHotelsSnapshot = await getDocs(collection(db, 'hotels'));
            const allHotels = allHotelsSnapshot.docs.map(doc => ({ ...doc.data() as NewHotel, id: doc.id }));
            
            const grandPalace = allHotels.find(h => h.name === 'The Grand Palace');
            const santoriniEscape = allHotels.find(h => h.name === 'Santorini Seaside Escape');
            const modernHub = allHotels.find(h => h.name === 'Modern City Hub');

            const roomsToSeed = [];
            if(grandPalace) roomsToSeed.push({ ...sampleRoomsData[0], hotelId: grandPalace.id });
            if(santoriniEscape) roomsToSeed.push({ ...sampleRoomsData[1], hotelId: santoriniEscape.id });
            if(modernHub) roomsToSeed.push({ ...sampleRoomsData[2], hotelId: modernHub.id });
            
            if(roomsToSeed.length > 0) {
                await seedCollection('rooms', roomsToSeed, 'title');
            }


        } else {
            console.log("Could not find an owner to seed hotels for.");
        }
    } catch (error) {
        console.error("Error seeding database:", error);
    }
};

// Immediately invoke the seeding function to ensure data is available on startup
seedDatabase();
