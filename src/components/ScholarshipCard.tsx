import React from 'react';
import { Calendar, DollarSign, ExternalLink, BookOpen, Sparkles, CheckCircle, XCircle } from 'lucide-react';
import type { Scholarship } from '../types';
import { cn } from '../lib/utils';

interface ScholarshipCardProps {
    scholarship: Scholarship;
    onSelect: (scholarship: Scholarship) => void;
    isApplied: boolean;
    onToggleApply: () => void;
    isHidden?: boolean;
    onToggleHide?: () => void;
}

import { useAuth } from '../context/AuthContext';

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({ scholarship, onSelect, isApplied, onToggleApply, isHidden, onToggleHide }) => {
    const { user } = useAuth();

    const handleApply = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleApply();
    };

    const handleHide = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleHide?.();
    };

    const handleTailorEssay = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) {
            alert("You need to be logged in to do that!");
            return;
        }
        onSelect(scholarship);
    };

    return (
        <div
            className={`glass-card p-6 rounded-2xl hover:scale-[1.02] transition-all group relative overflow-hidden ${isApplied ? 'border-green-500/30 bg-green-500/5' : ''} `}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1 pr-4">
                    <a
                        href={scholarship.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xl font-bold text-white hover:text-primary transition-colors cursor-pointer block mb-1"
                    >
                        {scholarship.name}
                    </a>
                    <p className="text-slate-400 text-sm">{scholarship.provider}</p>
                </div>
                <div className="flex flex-col items-end gap-3 shrink-0">
                    <div className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                        <span className="text-primary font-semibold text-sm">
                            {scholarship.amount > 0 ? `$${scholarship.amount.toLocaleString()}` : 'Varies'}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleApply}
                            className={`p-2 rounded-full transition-colors ${isApplied ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'} `}
                            title={isApplied ? "Marked as Applied" : "Mark as Applied"}
                        >
                            <CheckCircle className={`w-5 h-5 ${isApplied ? 'fill-current' : ''}`} />
                        </button>

                        {onToggleHide && (
                            <button
                                onClick={handleHide}
                                className={`p-2 rounded-full transition-colors ${isHidden ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'} `}
                                title={isHidden ? "Marked as Not Doing" : "Mark as Not Doing"}
                            >
                                <XCircle className={`w-5 h-5 ${isHidden ? 'fill-current' : ''}`} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-3 mt-auto">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</span>
                </div>

                <div className="flex gap-3 mt-4 pt-4 border-t border-white/10">
                    <button
                        onClick={handleTailorEssay}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        <BookOpen className="w-4 h-4" />
                        Tailor Essay
                    </button>
                    <a
                        href={scholarship.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-colors"
                        title="Visit Website"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ExternalLink className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </div>
    );
};
