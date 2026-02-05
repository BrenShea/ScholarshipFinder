import { db } from './firebaseConfig';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export interface UserProfile {
    id: string;
    full_name: string | null;
    age: number | null;
    graduation_year: number | null;
    is_transfer: boolean;
    interests: string[] | null;
    quiz_answers: Record<string, string> | null;
    base_essay: string | null;
    gemini_api_key: string | null;
    created_at?: string;
    updated_at?: string;
}

export const getProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
        const docRef = doc(db, 'profiles', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: userId, ...docSnap.data() } as UserProfile;
        }
        return null;
    } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
};

export const createProfile = async (userId: string, data: Partial<UserProfile>): Promise<boolean> => {
    try {
        const docRef = doc(db, 'profiles', userId);
        await setDoc(docRef, {
            ...data,
            id: userId,
            is_transfer: data.is_transfer ?? false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });
        return true;
    } catch (error) {
        console.error('Error creating profile:', error);
        return false;
    }
};

export const updateProfile = async (userId: string, updates: Partial<UserProfile>): Promise<boolean> => {
    try {
        const docRef = doc(db, 'profiles', userId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            // Create profile if it doesn't exist
            return createProfile(userId, updates);
        }

        await updateDoc(docRef, {
            ...updates,
            updated_at: new Date().toISOString(),
        });
        return true;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};
