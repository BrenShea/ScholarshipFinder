import React, { useState } from 'react';
import { Sparkles, X, Copy, Check, AlertCircle, CheckCircle } from 'lucide-react';
import type { Scholarship } from '../types';
import { generateTailoredEssay } from '../services/geminiApi';
import { useAuth } from '../context/AuthContext';
import { getProfile } from '../services/profileService';

interface EssayAssistantProps {
    scholarship: Scholarship;
    onClose: () => void;
    isApplied?: boolean;
    onToggleApply?: () => void;
}

export const EssayAssistant: React.FC<EssayAssistantProps> = ({ scholarship, onClose, isApplied, onToggleApply }) => {
    const [essayQuestion, setEssayQuestion] = useState('');
    const [generatedEssay, setGeneratedEssay] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [baseEssay, setBaseEssay] = useState('');
    const { user } = useAuth();

    // Load base essay from profile
    React.useEffect(() => {
        const loadBaseEssay = async () => {
            if (user) {
                const profile = await getProfile(user.id);
                if (profile?.base_essay) {
                    setBaseEssay(profile.base_essay);
                }
            }
        };
        loadBaseEssay();
    }, [user]);

    const handleGenerate = async () => {
        if (!baseEssay.trim()) {
            setError('Please add your base essay in Profile Settings first.');
            return;
        }

        if (!essayQuestion.trim()) {
            setError('Please enter the specific essay question for this scholarship.');
            return;
        }

        setIsGenerating(true);
        setError('');

        try {
            // Fetch user profile if logged in
            let userProfile;
            if (user) {
                userProfile = await getProfile(user.id);
            }

            const result = await generateTailoredEssay(essayQuestion, scholarship, userProfile || undefined);
            setGeneratedEssay(result);
        } catch (err: any) {
            setError(err.message || 'Failed to generate essay');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedEssay);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-4xl bg-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-dark-lighter">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="w-5 h-5 text-secondary" />
                            <h2 className="text-xl font-bold text-white">AI Essay Assistant</h2>
                        </div>
                        <p className="text-sm text-slate-400">
                            Tailoring for: <span className="text-primary">{scholarship.name}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-4">
                    {/* Input Section */}
                    <div className="lg:w-2/5 p-6 flex flex-col overflow-y-auto border-b lg:border-b-0 lg:border-r border-white/10">
                        {!baseEssay && (
                            <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400 text-sm">
                                <p>Please add your base essay in <strong>Profile Settings</strong> first.</p>
                            </div>
                        )}

                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Specific Essay Question
                        </label>
                        <textarea
                            value={essayQuestion}
                            onChange={(e) => setEssayQuestion(e.target.value)}
                            placeholder="E.g., 'Describe a challenge you've overcome and what you learned.'"
                            rows={6}
                            className="w-full bg-dark-lighter border border-white/10 rounded-xl p-4 text-slate-300 placeholder:text-slate-600 focus:ring-2 focus:ring-primary/50 focus:border-transparent resize-y transition-all mb-4"
                        />

                        <div className="mt-auto">
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || !baseEssay.trim() || !essayQuestion.trim()}
                                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                            >
                                {isGenerating ? (
                                    <>
                                        <Sparkles className="w-5 h-5 animate-pulse" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Generate Tailored Essay
                                    </>
                                )}
                            </button>

                            {error && (
                                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2 text-red-400 text-sm">
                                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Output Section */}
                    <div className="lg:w-3/5 p-6 flex flex-col bg-dark/50 overflow-y-auto">
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-slate-300">
                                Tailored Result
                            </label>
                            {generatedEssay && (
                                <div className="flex items-center gap-2">
                                    {onToggleApply && (
                                        <button
                                            onClick={onToggleApply}
                                            className={`flex items-center gap-1.5 text-xs font-medium transition-colors px-3 py-1.5 rounded-md border ${isApplied
                                                    ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20'
                                                    : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10'
                                                }`}
                                        >
                                            <CheckCircle className="w-3.5 h-3.5" />
                                            {isApplied ? 'Completed' : 'Mark Complete'}
                                        </button>
                                    )}
                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-2 py-1.5 rounded-md"
                                    >
                                        {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                                        {copied ? 'Copied!' : 'Copy Text'}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 relative min-h-[400px]">
                            {generatedEssay ? (
                                <textarea
                                    value={generatedEssay}
                                    readOnly
                                    className="w-full h-full bg-dark-lighter border border-primary/30 rounded-xl p-4 text-white focus:ring-2 focus:ring-primary/50 focus:border-transparent resize-none"
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-white/10 rounded-xl bg-white/5">
                                    <Sparkles className="w-12 h-12 mb-4 opacity-20" />
                                    <p className="text-center max-w-xs">
                                        Your tailored essay will appear here, optimized for the "{scholarship.name}" requirements.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
