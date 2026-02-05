import { db } from './firebaseConfig';
import { doc, setDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';

export interface UserScholarship {
    id: string;
    user_id: string;
    scholarship_id: string;
    status: 'applied' | 'saved' | 'hidden';
    applied_at: string;
}

// Helper to get user scholarships collection reference
const getUserScholarshipsRef = (userId: string) =>
    collection(db, 'users', userId, 'userScholarships');

export const getAppliedScholarships = async (userId: string): Promise<string[]> => {
    try {
        const q = query(
            getUserScholarshipsRef(userId),
            where('status', '==', 'applied')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.id);
    } catch (error) {
        console.error('Error fetching applied scholarships:', error);
        return [];
    }
};

export const markScholarshipAsApplied = async (userId: string, scholarshipId: string): Promise<boolean> => {
    try {
        const docRef = doc(db, 'users', userId, 'userScholarships', scholarshipId);
        await setDoc(docRef, {
            user_id: userId,
            scholarship_id: scholarshipId,
            status: 'applied',
            applied_at: new Date().toISOString()
        });
        return true;
    } catch (error) {
        console.error('Error marking scholarship as applied:', error);
        return false;
    }
};

export const removeAppliedScholarship = async (userId: string, scholarshipId: string): Promise<boolean> => {
    try {
        const docRef = doc(db, 'users', userId, 'userScholarships', scholarshipId);
        await deleteDoc(docRef);
        return true;
    } catch (error) {
        console.error('Error removing applied scholarship:', error);
        return false;
    }
};

export const getHiddenScholarships = async (userId: string): Promise<string[]> => {
    try {
        const q = query(
            getUserScholarshipsRef(userId),
            where('status', '==', 'hidden')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.id);
    } catch (error) {
        console.error('Error fetching hidden scholarships:', error);
        return [];
    }
};

export const markScholarshipAsHidden = async (userId: string, scholarshipId: string): Promise<boolean> => {
    try {
        const docRef = doc(db, 'users', userId, 'userScholarships', scholarshipId);
        await setDoc(docRef, {
            user_id: userId,
            scholarship_id: scholarshipId,
            status: 'hidden',
            applied_at: new Date().toISOString()
        });
        return true;
    } catch (error) {
        console.error('Error marking scholarship as hidden:', error);
        return false;
    }
};

export const removeHiddenScholarship = async (userId: string, scholarshipId: string): Promise<boolean> => {
    try {
        const docRef = doc(db, 'users', userId, 'userScholarships', scholarshipId);
        await deleteDoc(docRef);
        return true;
    } catch (error) {
        console.error('Error removing hidden scholarship:', error);
        return false;
    }
};

// Batch get all user scholarship statuses (for performance)
export const getAllUserScholarshipStatuses = async (userId: string): Promise<Map<string, 'applied' | 'hidden'>> => {
    try {
        const snapshot = await getDocs(getUserScholarshipsRef(userId));
        const statusMap = new Map<string, 'applied' | 'hidden'>();
        snapshot.docs.forEach(doc => {
            const data = doc.data();
            if (data.status === 'applied' || data.status === 'hidden') {
                statusMap.set(doc.id, data.status);
            }
        });
        return statusMap;
    } catch (error) {
        console.error('Error fetching all user scholarship statuses:', error);
        return new Map();
    }
};
