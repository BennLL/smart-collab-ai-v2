import React from 'react';
import { Link } from 'react-router-dom';
import { 
    Layout, 
    ArrowRight, 
    CheckCircle2, 
    Zap, 
    Shield, 
    Users, 
    Globe 
} from 'lucide-react';
import logo from '../img/logo.png';

function FrontPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-950 font-sans selection:bg-blue-200 dark:selection:bg-blue-900">
            
            {/* --- NAVBAR --- */}
            <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                <img src = {logo}></img>
                            </div>
                            <span className="text-xl font-bold text-slate-900 dark:text-white">
                                Smart Collab
                            </span>
                        </div>

                        {/* Nav Links */}
                        <div className="flex items-center gap-4">
                            <Link 
                                to="/login" 
                                className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm transition-colors hidden sm:block"
                            >
                                Sign In
                            </Link>
                            <Link 
                                to="/login" 
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium text-sm transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <div className="relative overflow-hidden pt-20 pb-20 lg:pt-32 lg:pb-28">
                {/* Background Blobs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute top-20 right-10 w-72 h-72 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-300 text-xs font-semibold uppercase tracking-wide mb-6">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        New v2.0 Released
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
                        Manage projects <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
                            without the chaos.
                        </span>
                    </h1>
                    
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-400">
                        The all-in-one workspace for your team. Plan, track, and collaborate on projects in real-time. secure, fast, and simple.
                    </p>

                    <div className="mt-10 flex justify-center gap-4">
                        <Link 
                            to="/login" 
                            className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg transition-all shadow-xl shadow-blue-600/20 hover:transform hover:-translate-y-1"
                        >
                            Start for free <ArrowRight size={20} />
                        </Link>
                        <button className="px-8 py-4 bg-white dark:bg-gray-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-gray-700 rounded-full font-bold text-lg hover:bg-slate-50 dark:hover:bg-gray-700 transition-all">
                            View Demo
                        </button>
                    </div>

                    {/* Preview
                    <div className="mt-20 relative mx-auto max-w-5xl">
                        <div className="rounded-xl bg-slate-900/5 dark:bg-white/5 p-2 lg:p-4 backdrop-blur-sm border border-slate-200/50 dark:border-white/10">
                            <img 
                                src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop" 
                                alt="App Dashboard Mockup" 
                                className="rounded-lg shadow-2xl border border-slate-200 dark:border-gray-800 w-full"
                            />
                        </div>
                    </div> */}
                </div>
            </div>

            {/* --- FEATURES GRID --- */}
            <div className="bg-white dark:bg-gray-900 py-24 border-t border-slate-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                            Everything you need to ship faster
                        </h2>
                        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                            Powering thousands of teams to build the future.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-8 rounded-2xl bg-slate-50 dark:bg-gray-800/50 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
                                <Zap className="text-blue-600 dark:text-blue-400" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Lightning Fast</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Built with the latest tech stack ensuring zero lag. Experience real-time updates as they happen.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 rounded-2xl bg-slate-50 dark:bg-gray-800/50 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-6">
                                <Shield className="text-green-600 dark:text-green-400" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Enterprise Security</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Your data is encrypted at rest and in transit. Role-based access control included by default.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 rounded-2xl bg-slate-50 dark:bg-gray-800/50 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-6">
                                <Globe className="text-purple-600 dark:text-purple-400" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Work Anywhere</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Fully responsive design works on desktop, tablet, and mobile. Syncs across all your devices.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- FOOTER --- */}
            <footer className="bg-slate-50 dark:bg-gray-950 py-12 border-t border-slate-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <img src = {logo} className="text-blue-600 w-6 h-6" />
                        <span className="font-bold text-slate-900 dark:text-white">Smart Collab</span>
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-sm">
                        © 2024 Smart Collab Inc. All rights reserved.
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">Twitter</a>
                        <a href="#" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">GitHub</a>
                        <a href="#" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">LinkedIn</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default FrontPage;