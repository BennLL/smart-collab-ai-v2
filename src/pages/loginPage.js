import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, Sparkles } from 'lucide-react';
import ThemeToggle from '../components/themeToggle';
import logo from '../img/logo.png';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

function LoginPage({ onLogin }) {
    const navigate = useNavigate();

    const [isSignUp, setIsSignUp] = useState(false); // toggle between login/signup
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (isSignUp) {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: window.location.origin + '/home'
                }
            });

            if (error) {
                setError(error.message);
                return;
            }

            if (data.user) {
                await supabase.from('profiles').insert({
                    id: data.user.id,
                    name
                });
            }

            setError(`Signup successful! Please check your email (${email}) to confirm your account.`);
            setEmail('');
            setPassword('');
            setName('');
        } else {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                setError(error.message);
                return;
            }

            if (onLogin) onLogin(true);
            navigate("/home");
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 dark:from-gray-950 dark:via-blue-800 dark:to-gray-950 flex items-center justify-center p-4 transition-colors duration-200 animate-fadeIn relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <ThemeToggle />

            <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
                {/* Left side - welcome info */}
                <div className="hidden lg:block space-y-6 animate-slideLeft">
                    <div className="flex items-center gap-3">
                        <div className="p-3">
                            <Link to="/"> <img className="w-[100px]" src={logo} alt="logo"></img></Link>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Smart Collab
                        </h2>
                    </div>
                    <h1 className="text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                        Welcome Back to Your Workspace
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Access your dashboard and continue where you left off. Your
                        productivity hub awaits.
                    </p>
                    <div className="space-y-4 pt-4">
                        {[
                            "Secure authentication",
                            "Multi-device sync",
                            "24/7 support available"
                        ].map((text, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                                    ✓
                                </div>
                                <p className="text-gray-700 dark:text-gray-300">
                                    {text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right side - form */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 lg:p-10 space-y-6 animate-slideRight border border-gray-200 dark:border-gray-700">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {isSignUp ? "Sign Up" : "Welcome Back"}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {isSignUp ? "Create a new account" : "Sign in to your account"}
                        </p>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {isSignUp && (
                            <div className="flex flex-col space-y-1">
                                <label className="text-gray-700 dark:text-gray-200 font-medium mb-1">
                                    Name:
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-500 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200"
                                />
                            </div>
                        )}

                        <div className="flex flex-col space-y-1">
                            <label className="text-gray-700 dark:text-gray-200 font-medium mb-1">
                                Email:
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-500 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200"
                            />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <label className="text-gray-700 dark:text-gray-200 font-medium mb-1">
                                Password:
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-500 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200"
                            />
                        </div>

                        <button
                            type="submit"
                            className="p-2 rounded w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                        >
                            {isSignUp ? "Sign Up" : "Sign In"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {isSignUp
                            ? "Already have an account? "
                            : "Don't have an account? "}
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                            {isSignUp ? "Sign In" : "Sign Up"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
