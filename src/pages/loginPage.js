import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, Sparkles } from 'lucide-react';
import ThemeToggle from '../components/themeToggle';
import logo from '../img/logo.png';

const MOCK_USERS = [
  {
    email: "test@example.com",
    password: "password123",
    name: "test user 1"
  },
  {
    email: "test2@example.com",
    password: "password123",
    name: "test user 2"
  },
];


function LoginPage({ onLogin }) {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault(); 

        const userFound = MOCK_USERS.find(
            (u) => u.email === email && u.password === password
        );

        if (userFound) {
            setError('');
            if (onLogin) onLogin(true); 
            navigate('/home');
        } else {
            setError('Invalid email or password. Try test@example.com / password123');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 dark:from-gray-950 dark:via-blue-800 dark:to-gray-950 flex items-center justify-center p-4 transition-colors duration-200 animate-fadeIn relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <ThemeToggle />

            <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
                {/* left side */}
                <div className="hidden lg:block space-y-6 animate-slideLeft">
                    <div className="flex items-center gap-3">
                        <div className="p-3">
                            <img className="w-[100px]" src={logo} alt="logo"></img>
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

                {/* right side */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 lg:p-10 space-y-6 animate-slideRight border border-gray-200 dark:border-gray-700">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Welcome Back
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Sign in to your account
                        </p>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="flex flex-col space-y-1">
                            <label className="text-gray-700 dark:text-gray-200 font-medium mb-1" htmlFor="email">
                                Email:
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-500 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200"
                            />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <label className="text-gray-700 dark:text-gray-200 font-medium mb-1" htmlFor="password">
                                Password:
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-500 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 cursor-pointer"
                                />
                                <label htmlFor="remember" className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                                    Remember me
                                </label>
                            </div>

                            <button
                                type="button"
                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
                            >
                                Forgot password?
                            </button>
                        </div>

                        <button
                            className="p-2 rounded w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                            type="submit"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                or continue with
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
                           <Sparkles size={20} /> Google
                        </button>
                        <button className="flex items-center justify-center gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
                           <Github size={20} /> GitHub
                        </button>
                    </div>

                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account?{' '}
                        <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;