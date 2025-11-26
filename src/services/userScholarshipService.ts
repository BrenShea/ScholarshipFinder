import { supabase } from './supabaseClient';

export interface UserScholarship {
    id: string;
    user_id: string;
    scholarship_id: string;
    status: 'applied' | 'saved' | 'hidden';
    applied_at: string;
}

export const getAppliedScholarships = async (userId: string): Promise<string[]> => {
    try {
        const { data, error } = await supabase
            .from('user_scholarships')
            .select('scholarship_id')
            .eq('user_id', userId)
            .eq('status', 'applied');

        if (error) throw error;
        return data.map(item => item.scholarship_id);
    } catch (error) {
        console.error('Error fetching applied scholarships:', error);
        return [];
    }
};

export const markScholarshipAsApplied = async (userId: string, scholarshipId: string): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('user_scholarships')
            .upsert({
                user_id: userId,
                scholarship_id: scholarshipId,
                status: 'applied',
                applied_at: new Date().toISOString()
            }, {
                onConflict: 'user_id,scholarship_id'
            });

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error marking scholarship as applied:', error);
        return false;
    }
};

export const removeAppliedScholarship = async (userId: string, scholarshipId: string): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('user_scholarships')
            .delete()
            .eq('user_id', userId)
            .eq('scholarship_id', scholarshipId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error removing applied scholarship:', error);
        return false;
    }
};

export const getHiddenScholarships = async (userId: string): Promise<string[]> => {
    try {
        const { data, error } = await supabase
            .from('user_scholarships')
            .select('scholarship_id')
            .eq('user_id', userId)
            .eq('status', 'hidden');

        if (error) throw error;
        return data.map(item => item.scholarship_id);
    } catch (error) {
        console.error('Error fetching hidden scholarships:', error);
        return [];
    }
};

export const markScholarshipAsHidden = async (userId: string, scholarshipId: string): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('user_scholarships')
            .upsert({
                user_id: userId,
                scholarship_id: scholarshipId,
                status: 'hidden',
                applied_at: new Date().toISOString()
            }, {
                onConflict: 'user_id,scholarship_id'
            });

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error marking scholarship as hidden:', error);
        return false;
    }
};

export const removeHiddenScholarship = async (userId: string, scholarshipId: string): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('user_scholarships')
            .delete()
            .eq('user_id', userId)
            .eq('scholarship_id', scholarshipId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error removing hidden scholarship:', error);
        return false;
    }
};
