
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

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


// Seed the database with a default admin user if it doesn't exist
const seedAdminUser = async () => {
    const usersCol = collection(db, "users");
    const adminEmail = "admin@lodgify.lite";
    const q = query(usersCol, where("email", "==", adminEmail));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        console.log("Admin user not found, creating one...");
        await addDoc(usersCol, {
            name: "Admin User",
            email: adminEmail,
            password: "adminpassword", // In a real app, hash this!
            role: "admin",
            createdAt: serverTimestamp(),
        });
        console.log("Admin user created.");
    } else {
        console.log("Admin user already exists.");
    }
};

seedAdminUser().catch(console.error);
