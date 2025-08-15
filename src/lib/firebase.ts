
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, addDoc, serverTimestamp, writeBatch, doc } from 'firebase/firestore';
import type { NewHotel, NewUser } from './types';


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
const sampleUsers: NewUser[] = [
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


// --- Seeding Functions ---

const seedCollection = async <T extends object>(collectionName: string, data: T[]) => {
    const collectionRef = collection(db, collectionName);
    console.log(`Checking if ${collectionName} collection needs seeding...`);
    
    const initialCheck = await getDocs(query(collectionRef));
    if (!initialCheck.empty) {
        console.log(`${collectionName} collection already contains data. Seeding skipped.`);
        const docs = initialCheck.docs.map(doc => ({ ...doc.data() as T, id: doc.id }));
        return docs;
    }
    
    console.log(`${collectionName} collection is empty. Seeding data...`);
    const batch = writeBatch(db);
    const docRefs: (T & { id: string })[] = [];

    for (const item of data) {
        const newDocRef = doc(collectionRef);
        batch.set(newDocRef, { ...item, createdAt: serverTimestamp() });
        docRefs.push({ ...item, id: newDocRef.id });
    }

    await batch.commit();
    console.log(`${data.length} documents seeded into ${collectionName}.`);
    return docRefs;
};

const seedDatabase = async () => {
    try {
        const users = await seedCollection<NewUser>('users', sampleUsers);

        const owner = users.find(u => u.role === 'owner');

        if (owner) {
            const hotelsToSeed = sampleHotelsData.map(hotel => ({
                ...hotel,
                ownerId: owner.id,
                ownerName: owner.name,
                ownerEmail: owner.email,
            }));
            await seedCollection('hotels', hotelsToSeed);
        } else {
            console.log("Could not find an owner to seed hotels for.");
        }
    } catch (error) {
        console.error("Error seeding database:", error);
    }
};

// Immediately invoke the seeding function to ensure data is available on startup
seedDatabase();
