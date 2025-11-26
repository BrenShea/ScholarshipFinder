import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

interface SearchFormProps {
    onSearch: (region: string) => void;
    isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white p-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                )}
                {isLoading ? 'Searching...' : 'Find Scholarships'}
            </button>
        </form>
    );
};
