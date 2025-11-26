import { supabase } from './supabaseClient';

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
}

export const getProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
};

export const updateProfile = async (userId: string, updates: Partial<UserProfile>) => {
    try {
        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};
