import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProfile, updateProfile } from '../../services/profileService';
import { Save, User, Key, BookOpen, CheckCircle } from 'lucide-react';
import { Quiz } from './Quiz';

export const ProfileSettings = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Form state
    const [fullName, setFullName] = useState('');
    const [age, setAge] = useState('');
    const [gradYear, setGradYear] = useState('');
    const [isTransfer, setIsTransfer] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
    const [baseEssay, setBaseEssay] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [showQuiz, setShowQuiz] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        } else if (user) {
            loadProfile();
        }
    }, [user, loading, navigate]);

    const loadProfile = async () => {
        if (!user) return;
        try {
            const data = await getProfile(user.uid);
            if (data) {
                setFullName(data.full_name || '');
                setAge(data.age?.toString() || '');
                setGradYear(data.graduation_year?.toString() || '');
                setIsTransfer(data.is_transfer || false);
                setQuizAnswers(data.quiz_answers || {});
                setBaseEssay(data.base_essay || '');
                setApiKey(data.gemini_api_key || '');
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!user) return;
        setSaving(true);
        setMessage(null);

        try {
            await updateProfile(user.uid, {
                full_name: fullName,
                age: age ? parseInt(age) : null,
                graduation_year: gradYear ? parseInt(gradYear) : null,
                is_transfer: isTransfer,
                quiz_answers: quizAnswers,
                base_essay: baseEssay,
                gemini_api_key: apiKey
            });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setSaving(false);
        }
    };

    const handleQuizSave = (answers: Record<string, string>) => {
        setQuizAnswers(answers);
        setShowQuiz(false);
        // We need to trigger a save to persist the quiz answers immediately
        // But we can't call handleSave directly because of state updates not being immediate
        // So we'll update the state and then call updateProfile directly here
        if (user) {
            setSaving(true);
            updateProfile(user.uid, {
                quiz_answers: answers
            }).then(() => {
                setMessage({ type: 'success', text: 'Quiz answers saved!' });
                setSaving(false);
            }).catch(() => {
                setMessage({ type: 'error', text: 'Failed to save quiz answers.' });
                setSaving(false);
            });
        }
    };

    if (loading) return <div className="text-center py-12 text-slate-400">Loading profile...</div>;

    const hasQuizAnswers = Object.keys(quizAnswers).length > 0;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-white mb-8">Profile Settings</h1>

            <div className="space-y-8">
                {/* Personal Details */}
                <div className="glass-card p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <User className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">Personal Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-dark-lighter border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Age</label>
                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                className="w-full bg-dark-lighter border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Graduation Year</label>
                            <input
                                type="number"
                                value={gradYear}
                                onChange={(e) => setGradYear(e.target.value)}
                                className="w-full bg-dark-lighter border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-center pt-8">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isTransfer}
                                    onChange={(e) => setIsTransfer(e.target.checked)}
                                    className="w-5 h-5 rounded border-white/10 bg-dark-lighter text-primary focus:ring-primary/50"
                                />
                                <span className="text-slate-300">I am a transfer student</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Tailoring Quiz */}
                <div className="glass-card p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-secondary/10 rounded-lg">
                                <BookOpen className="w-5 h-5 text-secondary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white">Tailoring Quiz</h2>
                                <p className="text-sm text-slate-400">Answer 10 questions to help AI write better essays for you.</p>
                            </div>
                        </div>
                        {hasQuizAnswers && !showQuiz && (
                            <div className="flex items-center gap-2 text-green-400 bg-green-500/10 px-3 py-1.5 rounded-lg text-sm font-medium">
                                <CheckCircle className="w-4 h-4" />
                                <span>Completed</span>
                            </div>
                        )}
                    </div>

                    {showQuiz ? (
                        <div className="animate-fade-in">
                            <Quiz initialAnswers={quizAnswers} onSave={handleQuizSave} />
                            <button
                                onClick={() => setShowQuiz(false)}
                                className="mt-4 text-sm text-slate-400 hover:text-white underline"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div className="bg-dark-lighter rounded-xl p-6 text-center border border-white/5">
                            {hasQuizAnswers ? (
                                <div>
                                    <p className="text-slate-300 mb-4">You have completed the tailoring quiz. You can retake it anytime to update your profile.</p>
                                    <button
                                        onClick={() => setShowQuiz(true)}
                                        className="bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/50 px-6 py-2 rounded-xl transition-all"
                                    >
                                        Retake Quiz
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-slate-300 mb-4">Take the quiz to personalize your scholarship essays.</p>
                                    <button
                                        onClick={() => setShowQuiz(true)}
                                        className="bg-secondary hover:bg-secondary/90 text-white px-8 py-3 rounded-xl transition-all shadow-lg shadow-secondary/20 font-medium"
                                    >
                                        Start Quiz
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Base Essay */}
                <div className="glass-card p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <BookOpen className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">Base Essay / Story</h2>
                            <p className="text-sm text-slate-400">Your general college essay or personal story used for all scholarships.</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Your Story</label>
                        <textarea
                            value={baseEssay}
                            onChange={(e) => setBaseEssay(e.target.value)}
                            placeholder="Paste your general college essay or personal story here. This will be used as the foundation for all scholarship applications..."
                            rows={12}
                            className="w-full bg-dark-lighter border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/50 focus:border-transparent resize-none"
                        />
                        <p className="mt-2 text-xs text-slate-500">
                            This essay will be automatically tailored to each scholarship's requirements.
                        </p>
                    </div>
                </div>

                {/* API Key */}
                <div className="glass-card p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                            <Key className="w-5 h-5 text-green-500" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">Gemini API Key</h2>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">API Key</label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter your Gemini API Key"
                            className="w-full bg-dark-lighter border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                        />
                        <p className="mt-2 text-xs text-slate-500">
                            Your key is stored securely in your profile and used for essay generation.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                    {message && (
                        <div className={`px - 4 py - 2 rounded - lg text - sm ${message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'} `}>
                            {message.text}
                        </div>
                    )}
                    <button
                        onClick={(e) => handleSave(e)}
                        disabled={saving}
                        className="ml-auto bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};
