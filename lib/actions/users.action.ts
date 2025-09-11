import { db } from "@/firebase/admin";
import { CollectionReference } from 'firebase-admin/firestore';

// Assuming User type exists or needs to be defined
interface User {
    id?: string;
    [key: string]: any; // Add specific user properties here
}

export function getUserQuery(): CollectionReference<User> {
    return db.collection("users");
}

export async function getAllUsers(): Promise<User[]> {
    try {
        const querySnapshot = await getUserQuery().get();
        if (querySnapshot.empty) return [];

        const users = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as User[];

        return users;
    } catch (error) {
        console.error("Error fetching all users:", error);
        return [];
    }
}