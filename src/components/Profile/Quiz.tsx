import React, { useState, useEffect } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

interface QuizProps {
    initialAnswers?: Record<string, string>;
    onSave: (answers: Record<string, string>) => void;
}

const QUESTIONS = [
    {
        id: 'field_of_study',
        question: 'Field of Study',
        options: ['Arts', 'Business', 'STEM', 'Social Sciences', 'Health', 'Other']
    },
    {
        id: 'career_goal',
        question: 'Career Goal',
        options: ['Entrepreneur', 'Researcher', 'Corporate Leader', 'Public Servant', 'Artist', 'Other']
    },
    {
        id: 'biggest_challenge',
        question: 'Biggest Challenge Type',
        options: ['Financial Hardship', 'Academic Struggle', 'Personal/Family Issue', 'Health/Disability', 'Cultural Barrier', 'Other']
    },
    {
        id: 'key_achievement',
        question: 'Key Achievement Type',
        options: ['High GPA/Honors', 'Community Service Award', 'Leadership Position', 'Personal Project', 'Overcoming Adversity', 'Other']
    },
    {
        id: 'leadership_style',
        question: 'Leadership Style',
        options: ['Lead by Example', 'Collaborative/Democratic', 'Visionary/Strategic', 'Mentor/Coach', 'Hands-on', 'Other']
    },
    {
        id: 'community_service',
        question: 'Community Service Focus',
        options: ['Education/Tutoring', 'Environment', 'Poverty/Homelessness', 'Health/Wellness', 'Social Justice', 'Other']
    },
    {
        id: 'primary_hobby',
        question: 'Primary Hobby/Interest',
        options: ['Sports/Athletics', 'Creative Arts', 'Technology/Coding', 'Reading/Writing', 'Outdoor/Nature', 'Other']
    },
    {
        id: 'soft_skill',
        question: 'Top Soft Skill',
        options: ['Communication', 'Problem Solving', 'Adaptability', 'Teamwork', 'Work Ethic', 'Other']
    },
    {
        id: 'role_model',
        question: 'Role Model Category',
        options: ['Family Member', 'Teacher/Mentor', 'Historical Figure', 'Industry Leader', 'Community Leader', 'Other']
    },
    {
        id: 'long_term_goal',
        question: 'Long-term Goal (10 years)',
        options: ['Executive/C-Suite', 'Business Owner', 'Expert/Specialist', 'Social Impact Leader', 'Academic/Professor', 'Other']
    }
];

export const Quiz: React.FC<QuizProps> = ({ initialAnswers = {}, onSave }) => {
    const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
    const [otherInputs, setOtherInputs] = useState<Record<string, string>>({});
    const [expanded, setExpanded] = useState<string | null>(QUESTIONS[0].id);

    // Initialize other inputs if initial answers contain values not in options
    useEffect(() => {
        const newOtherInputs: Record<string, string> = {};
        QUESTIONS.forEach(q => {
            const answer = initialAnswers[q.id];
            if (answer && !q.options.includes(answer)) {
                // It's a custom answer, so set it as 'Other' + input value
                // But wait, we store the actual string. So if it's not in options, it must be custom.
                // We need to set the dropdown to 'Other' and the input to the value.
                newOtherInputs[q.id] = answer;
            }
        });
        setOtherInputs(newOtherInputs);
    }, [initialAnswers]);

    const handleSelect = (questionId: string, value: string) => {
        if (value === 'Other') {
            // If selecting Other, clear the answer for now until they type
            const newAnswers = { ...answers };
            delete newAnswers[questionId];
            setAnswers(newAnswers);

            // Set other input to empty if not already set
            if (!otherInputs[questionId]) {
                setOtherInputs(prev => ({ ...prev, [questionId]: '' }));
            }
        } else {
            // If selecting a standard option, update answer and clear other input
            setAnswers(prev => ({ ...prev, [questionId]: value }));
            setOtherInputs(prev => {
                const next = { ...prev };
                delete next[questionId];
                return next;
            });
        }

        // Auto-advance to next question if not Other
        if (value !== 'Other') {
            const currentIndex = QUESTIONS.findIndex(q => q.id === questionId);
            if (currentIndex < QUESTIONS.length - 1) {
                setExpanded(QUESTIONS[currentIndex + 1].id);
            } else {
                setExpanded(null); // Close all if last question
            }
        }
    };

    const handleOtherInput = (questionId: string, value: string) => {
        setOtherInputs(prev => ({ ...prev, [questionId]: value }));
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const isComplete = QUESTIONS.every(q => !!answers[q.id]);

    return (
        <div className="space-y-4">
            {QUESTIONS.map((q, index) => {
                const isExpanded = expanded === q.id;
                const currentAnswer = answers[q.id];
                const isOther = otherInputs[q.id] !== undefined || (currentAnswer && !q.options.includes(currentAnswer));

                return (
                    <div key={q.id} className={`bg-dark-lighter border ${isExpanded ? 'border-primary/50' : 'border-white/5'} rounded-xl overflow-hidden transition-all`}>
                        <button
                            type="button"
                            onClick={() => setExpanded(isExpanded ? null : q.id)}
                            className="w-full flex items-center justify-between p-4 text-left"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${currentAnswer ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-slate-400'}`}>
                                    {currentAnswer ? <Check className="w-3 h-3" /> : index + 1}
                                </div>
                                <span className={`font-medium ${isExpanded ? 'text-white' : 'text-slate-300'}`}>
                                    {q.question}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                {currentAnswer && !isExpanded && (
                                    <span className="text-sm text-slate-400 truncate max-w-[150px]">
                                        {currentAnswer}
                                    </span>
                                )}
                                {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                            </div>
                        </button>

                        {isExpanded && (
                            <div className="p-4 pt-0 border-t border-white/5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                                    {q.options.map(option => (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => handleSelect(q.id, option)}
                                            className={`p-3 rounded-lg text-sm text-left transition-colors ${(option === 'Other' && isOther) || option === currentAnswer
                                                ? 'bg-primary/20 text-primary border border-primary/30'
                                                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>

                                {isOther && (
                                    <div className="mt-3 animate-fade-in">
                                        <input
                                            type="text"
                                            value={otherInputs[q.id] || ''}
                                            onChange={(e) => handleOtherInput(q.id, e.target.value)}
                                            placeholder="Please specify..."
                                            className="w-full bg-dark border border-white/10 rounded-lg p-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                                            autoFocus
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}

            <div className="pt-4 flex justify-end">
                <button
                    type="button"
                    onClick={() => onSave(answers)}
                    disabled={!isComplete}
                    className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-2 rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Save Quiz Answers
                </button>
            </div>
        </div>
    );
};
