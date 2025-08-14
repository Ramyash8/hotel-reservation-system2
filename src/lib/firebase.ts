
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, addDoc, serverTimestamp, writeBatch, doc } from 'firebase/firestore';
import type { NewHotel, NewRoom, NewUser } from './types';


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
    { name: 'Alice Wanderer', email: 'alice@test.com', password: 'password', role: 'user' },
    { name: 'Bob Hostelson', email: 'bob@test.com', password: 'password', role: 'owner' },
    { name: 'Charlie Admin', email: 'admin@lodgify.lite', password: 'adminpassword', role: 'admin' },
];

const sampleHotels: Omit<NewHotel, 'ownerId' | 'ownerName' | 'ownerEmail'>[] = [
    { name: 'Aegean Paradise Villa', location: 'Oia, Greece', description: 'Breathtaking sunset views over the caldera. A true Cycladic dream.', category: 'Premium', 'data-ai-hint': 'luxury villa' },
    { name: 'Cappadocia Cave Suites', location: 'Göreme, Turkey', description: 'Stay in a beautifully restored cave dwelling with all modern comforts.', category: 'Historic', 'data-ai-hint': 'cave hotel' },
    { name: 'Kyoto Serenity Inn', location: 'Kyoto, Japan', description: 'A traditional Ryokan experience with tatami floors and a peaceful zen garden.', category: 'Boutique', 'data-ai-hint': 'japanese inn' },
    { name: 'Alpine Ski Lodge', location: 'Chamonix, France', description: 'Ski-in/ski-out access to the best slopes in the Alps.', category: 'Ski Resort', 'data-ai-hint': 'ski lodge' },
    { name: 'Tuscan Vineyard Escape', location: 'Florence, Italy', description: 'A charming farmhouse surrounded by rolling hills and vineyards.', 'data-ai-hint': 'vineyard farmhouse' },
    { name: 'Santorini Blue Dome', location: 'Oia, Greece', description: 'Iconic blue-domed stay with a private plunge pool.', 'data-ai-hint': 'santorini dome' },
    { name: 'Istanbul Bazaar Hotel', location: 'Istanbul, Turkey', description: 'Steps away from the Grand Bazaar, immerse yourself in the vibrant city life.', category: 'Boutique', 'data-ai-hint': 'city hotel' },
];


// --- Seeding Functions ---

const seedCollection = async <T extends object>(collectionName: string, data: T[], checkField?: keyof T) => {
    const collectionRef = collection(db, collectionName);
    console.log(`Checking if ${collectionName} collection needs seeding...`);
    
    // Check if the entire collection is empty
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
        // We add the id to the item so we can use it later when seeding dependent collections
        docRefs.push({ ...item, id: newDocRef.id });
    }

    await batch.commit();
    console.log(`${data.length} documents seeded into ${collectionName}.`);
    return docRefs;
};

const seedDatabase = async () => {
    try {
        const users = await seedCollection<NewUser>('users', sampleUsers, 'email');

        const owner = users.find(u => u.role === 'owner');

        if (owner) {
            const hotelsToSeed = sampleHotels.map(hotel => ({
                ...hotel,
                ownerId: owner.id,
                ownerName: owner.name,
                ownerEmail: owner.email,
                status: 'approved' as const, // Ensure hotels are approved
            }));
            await seedCollection<Omit<NewHotel, 'ownerId' | 'ownerName' | 'ownerEmail'> & { ownerId: string, ownerName: string, ownerEmail: string, status: 'approved' }>('hotels', hotelsToSeed, 'name');
        } else {
            console.log("Could not find an owner to seed hotels for.");
        }
    } catch (error) {
        console.error("Error seeding database:", error);
    }
};

// Immediately invoke the seeding function
seedDatabase();
