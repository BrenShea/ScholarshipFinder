import { supabase } from './supabaseClient';

let cachedApiKey: string | null = null;

export const getGeminiApiKey = async (): Promise<string> => {
    // Return cached key if available
    if (cachedApiKey) {
        return cachedApiKey;
    }

    try {
        const { data, error } = await supabase
            .from('app_config')
            .select('value')
            .eq('key', 'gemini_api_key')
            .single();

        if (error) {
            console.error('Error fetching API key from Supabase:', error);
            throw new Error('Failed to fetch API key from database');
        }

        if (!data?.value) {
            throw new Error('API key not found in database');
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
        const { error } = await supabase
            .from('app_config')
            .upsert({ key: 'gemini_api_key', value: newKey }, { onConflict: 'key' });

        if (error) {
            console.error('Error updating API key in Supabase:', error);
            throw new Error('Failed to update API key in database');
        }

        // Update cache
        cachedApiKey = newKey;
    } catch (error) {
        console.error('Error in updateGeminiApiKey:', error);
        throw error;
    }
};
