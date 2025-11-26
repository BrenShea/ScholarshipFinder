import { Key, BookOpen, Lightbulb, ExternalLink, ChevronRight } from 'lucide-react';

export const Tutorials = () => {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold text-white mb-2">Tutorials & Guides</h1>
            <p className="text-slate-400 mb-8">Learn how to get the most out of ScholarshipFinder and improve your applications.</p>

            <div className="space-y-8">
                {/* Gemini API Key Guide */}
                <div className="glass-card p-8 rounded-2xl border border-primary/20 bg-primary/5">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="p-3 bg-primary/20 rounded-xl text-primary">
                            <Key className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">How to Get a Free Gemini API Key</h2>
                            <p className="text-slate-300">
                                To use the AI Essay Assistant, you need a free API key from Google. Follow these steps to get one in under 2 minutes.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6 pl-4 border-l-2 border-white/10 ml-6">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 -ml-[25px] w-8 h-8 rounded-full bg-dark border border-white/10 flex items-center justify-center text-sm font-bold text-white">1</div>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">Go to Google AI Studio</h3>
                                <p className="text-slate-400 mb-2">Visit the Google AI Studio website to create your key.</p>
                                <a
                                    href="https://aistudio.google.com/app/apikey"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-primary hover:text-primary-light transition-colors"
                                >
                                    Visit Google AI Studio <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 -ml-[25px] w-8 h-8 rounded-full bg-dark border border-white/10 flex items-center justify-center text-sm font-bold text-white">2</div>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">Create API Key</h3>
                                <p className="text-slate-400">
                                    Click the blue <strong>"Create API key"</strong> button. You may need to sign in with your Google account.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 -ml-[25px] w-8 h-8 rounded-full bg-dark border border-white/10 flex items-center justify-center text-sm font-bold text-white">3</div>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">Select Project</h3>
                                <p className="text-slate-400">
                                    If asked, select "Create API key in new project".
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 -ml-[25px] w-8 h-8 rounded-full bg-dark border border-white/10 flex items-center justify-center text-sm font-bold text-white">4</div>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">Copy & Save</h3>
                                <p className="text-slate-400">
                                    Copy the generated key (it starts with "AIza..."). Go back to ScholarshipFinder, click <strong>Settings</strong>, and paste it into the API Key field.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Base Essay Guide */}
                <div className="glass-card p-8 rounded-2xl">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Writing a Great Base Essay</h2>
                            <p className="text-slate-300">
                                Your base essay is the foundation for all AI-generated essays. The better your story, the better the results.
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white/5 p-6 rounded-xl">
                            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                <span className="text-green-400">✓</span> Do Include
                            </h3>
                            <ul className="space-y-2 text-slate-300 text-sm">
                                <li className="flex items-start gap-2">
                                    <ChevronRight className="w-4 h-4 mt-0.5 text-white/20" />
                                    Specific challenges you've overcome
                                </li>
                                <li className="flex items-start gap-2">
                                    <ChevronRight className="w-4 h-4 mt-0.5 text-white/20" />
                                    Leadership roles and what you learned
                                </li>
                                <li className="flex items-start gap-2">
                                    <ChevronRight className="w-4 h-4 mt-0.5 text-white/20" />
                                    Your career goals and "why" behind them
                                </li>
                                <li className="flex items-start gap-2">
                                    <ChevronRight className="w-4 h-4 mt-0.5 text-white/20" />
                                    Unique family or personal circumstances
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white/5 p-6 rounded-xl">
                            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                <span className="text-red-400">✗</span> Avoid
                            </h3>
                            <ul className="space-y-2 text-slate-300 text-sm">
                                <li className="flex items-start gap-2">
                                    <ChevronRight className="w-4 h-4 mt-0.5 text-white/20" />
                                    Generic statements like "I work hard"
                                </li>
                                <li className="flex items-start gap-2">
                                    <ChevronRight className="w-4 h-4 mt-0.5 text-white/20" />
                                    Listing resume items without context
                                </li>
                                <li className="flex items-start gap-2">
                                    <ChevronRight className="w-4 h-4 mt-0.5 text-white/20" />
                                    Focusing only on grades
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* General Tips */}
                <div className="glass-card p-8 rounded-2xl">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="p-3 bg-yellow-500/20 rounded-xl text-yellow-400">
                            <Lightbulb className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Scholarship Application Tips</h2>
                            <p className="text-slate-300">
                                Maximize your chances of winning with these strategies.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 font-bold text-white">1</div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Apply for Local Scholarships</h3>
                                <p className="text-slate-400 text-sm mt-1">
                                    National scholarships have thousands of applicants. Local ones (Rotary, Lions Club, local businesses) have far fewer.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 font-bold text-white">2</div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Don't Ignore Small Awards</h3>
                                <p className="text-slate-400 text-sm mt-1">
                                    $500 scholarships add up quickly and often have less competition than the $10,000 ones.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 font-bold text-white">3</div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Tailor Every Essay</h3>
                                <p className="text-slate-400 text-sm mt-1">
                                    Never copy-paste the exact same essay. Use our AI tool to tailor your story to the specific question asked.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
