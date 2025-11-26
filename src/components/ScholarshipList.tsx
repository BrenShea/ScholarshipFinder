import { useState, useEffect, useMemo } from 'react';
import type { Scholarship } from '../types';
import { ScholarshipCard } from './ScholarshipCard';
import { ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getProfile } from '../services/profileService';

interface ScholarshipListProps {
    scholarships: Scholarship[];
    onSelect: (scholarship: Scholarship) => void;
    isLoading?: boolean;
    appliedScholarships: string[];
    onToggleApply: (id: string) => void;
    hiddenScholarships?: string[];
    onToggleHide?: (id: string) => void;
    totalCount?: number;
    currentPage?: number;
    onPageChange?: (page: number) => void;
}

type SortOption = 'relevance' | 'amount-high' | 'amount-low' | 'deadline';

export function ScholarshipList({ scholarships, onSelect, isLoading, appliedScholarships, onToggleApply, hiddenScholarships, onToggleHide, totalCount, currentPage = 1, onPageChange }: ScholarshipListProps) {
    const [sortOption, setSortOption] = useState<SortOption>('relevance');
    const [userQuizAnswers, setUserQuizAnswers] = useState<Record<string, string>>({});
    const { user } = useAuth();
    const ITEMS_PER_PAGE = 20;

    useEffect(() => {
        if (user) {
            getProfile(user.id).then(profile => {
                if (profile?.quiz_answers) {
                    setUserQuizAnswers(profile.quiz_answers);
                }
            });
        }
    }, [user]);

    const calculateRelevanceScore = (scholarship: Scholarship, answers: Record<string, string>) => {
        let score = 0;
        const text = `${scholarship.name} ${scholarship.description} ${scholarship.requirements?.join(' ') || ''}`.toLowerCase();

        // Keywords from quiz answers to check
        const keywords = [
            answers['field_of_study'],
            answers['career_goal'],
            answers['primary_hobby']
        ].filter(Boolean).map(k => k.toLowerCase());

        keywords.forEach(keyword => {
            if (text.includes(keyword)) score += 2;
        });

        return score;
    };

    const sortedScholarships = useMemo(() => {
        let sorted = [...scholarships];

        switch (sortOption) {
            case 'amount-high':
                sorted.sort((a, b) => b.amount - a.amount);
                break;
            case 'amount-low':
                sorted.sort((a, b) => a.amount - b.amount);
                break;
            case 'deadline':
                sorted.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
                break;
            case 'relevance':
                // Simple relevance scoring based on quiz answers
                if (Object.keys(userQuizAnswers).length > 0) {
                    sorted.sort((a, b) => {
                        const scoreA = calculateRelevanceScore(a, userQuizAnswers);
                        const scoreB = calculateRelevanceScore(b, userQuizAnswers);
                        return scoreB - scoreA;
                    });
                }
                break;
        }
        return sorted;
    }, [scholarships, sortOption, userQuizAnswers]);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="glass-card h-64 rounded-2xl p-6 animate-pulse">
                        <div className="h-6 bg-white/10 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-white/5 rounded w-1/2 mb-8"></div>
                        <div className="space-y-3">
                            <div className="h-4 bg-white/5 rounded w-full"></div>
                            <div className="h-4 bg-white/5 rounded w-5/6"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (scholarships.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-400 text-lg mb-4">No scholarships found.</p>
                <p className="text-slate-500 text-sm">
                    If this is unexpected, try syncing the database in <a href="/profile" className="text-primary hover:underline">Profile Settings</a>.
                </p>
            </div>
        );
    }

    // Use totalCount if provided (server-side), otherwise fallback to local length
    const effectiveTotalCount = totalCount || sortedScholarships.length;
    const totalPages = Math.ceil(effectiveTotalCount / ITEMS_PER_PAGE);

    // If onPageChange is provided, we assume server-side pagination, so we render all items
    // Otherwise we slice locally
    const currentScholarships = onPageChange ? sortedScholarships : sortedScholarships.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handlePageChange = (newPage: number) => {
        if (onPageChange) {
            onPageChange(newPage);
        }
        // If local, the parent controls currentPage, or we could have local state if we wanted
        // But for now we assume parent control via props
    };

    return (
        <div className="animate-slide-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    Available Scholarships
                    <span className="text-sm font-normal text-slate-400 bg-white/5 px-3 py-1 rounded-full">
                        {effectiveTotalCount} found
                    </span>
                </h3>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value as SortOption)}
                            className="appearance-none bg-dark-lighter border border-white/10 text-white pl-10 pr-8 py-2 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-transparent outline-none cursor-pointer"
                        >
                            <option value="relevance">Relevance</option>
                            <option value="amount-high">Amount: High to Low</option>
                            <option value="amount-low">Amount: Low to High</option>
                            <option value="deadline">Deadline: Soonest</option>
                        </select>
                        <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
            </div>

            {totalPages > 1 && (
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div className="text-slate-400 text-sm hidden md:block">
                        Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, effectiveTotalCount)} of {effectiveTotalCount} scholarships
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <span className="text-slate-300 font-medium">
                            Page {currentPage} of {totalPages}
                        </span>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentScholarships.map((scholarship) => (
                    <ScholarshipCard
                        key={scholarship.id}
                        scholarship={scholarship}
                        onSelect={onSelect}
                        isApplied={appliedScholarships.includes(scholarship.id)}
                        onToggleApply={() => onToggleApply(scholarship.id)}
                        isHidden={hiddenScholarships?.includes(scholarship.id)}
                        onToggleHide={() => onToggleHide?.(scholarship.id)}
                    />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8 pt-6 border-t border-white/10">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <span className="text-slate-300 font-medium">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
};
