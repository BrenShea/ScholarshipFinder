import { db } from './firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

let cachedApiKey: string | null = null;

export const getGeminiApiKey = async (): Promise<string> => {
    // Return cached key if available
    if (cachedApiKey) {
        return cachedApiKey;
    }

    try {
        const docRef = doc(db, 'config', 'gemini_api_key');
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error('API key not found in database');
        }

        const data = docSnap.data();
        if (!data?.value) {
            throw new Error('API key value is empty');
        }

        cachedApiKey = data.value;
        return data.value;
    } catch (error) {
        console.error('Error in getGeminiApiKey:', error);
        throw error;
    }
};

export const updateGeminiApiKey = async (newKey: string): Promise<void> => {
    try {
        const docRef = doc(db, 'config', 'gemini_api_key');
        await setDoc(docRef, {
            key: 'gemini_api_key',
            value: newKey,
            updated_at: new Date().toISOString()
        });

        // Update cache
        cachedApiKey = newKey;
    } catch (error) {
        console.error('Error in updateGeminiApiKey:', error);
        throw error;
    }
};
