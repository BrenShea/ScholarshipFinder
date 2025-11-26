import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            navigate('/');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md glass-card p-8 rounded-2xl animate-fade-in">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <LogIn className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-dark-lighter border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-dark-lighter border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="mt-6 text-center text-slate-400 text-sm">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};
