import { useState, useEffect } from 'react';
import {
    PlusCircle,
    Calendar,
    User,
    Key,
    Copy,
    Check,
    Plus,
    ArrowRight,
    Layout
} from 'lucide-react';
import SideBar from '../components/sideBar';


const CURRENT_USER = {
    id: "user_123",
    name: "test user 1",
    email: 'test@gmail.com'
};

const INITIAL_PROJECTS = [
    {
        id: 1,
        name: "AI Navigation System",
        description: "Developing a YOLO-based navigation system for UAVs in GPS-denied environments.",
        created_at: "2025-11-20T10:00:00Z",
        owner_id: "user_123",
        join_key: "NAV-8821"
    },
    {
        id: 2,
        name: "Web App",
        description: "React frontend with Tailwind CSS and fake JSON backend.",
        created_at: "2025-11-25T14:30:00Z",
        owner_id: "user_123",
        join_key: "REA-9912"
    },
    {
        id: 3,
        name: "Geography Class Group",
        description: "Group project for California Cultural Regions.",
        created_at: "2025-10-15T09:00:00Z",
        owner_id: "user_999",
        join_key: "GEO-1123"
    }
];

export default function HomePage({ onLogout }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [currentView, setCurrentView] = useState('home');

    const [copiedKey, setCopiedKey] = useState(null);
    const [createName, setCreateName] = useState('');
    const [createDesc, setCreateDesc] = useState('');
    const [joinKey, setJoinKey] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setProjects(INITIAL_PROJECTS);
            setLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);


    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    };

    const copyJoinKey = (key) => {
        navigator.clipboard.writeText(key);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const handleCreateProject = (e) => {
        e.preventDefault();
        if (!createName.trim()) {
            setError("Project name is required");
            return;
        }

        const newProject = {
            id: Date.now(),
            name: createName,
            description: createDesc,
            created_at: new Date().toISOString(),
            owner_id: CURRENT_USER.id,
            join_key: `NEW-${Math.floor(Math.random() * 10000)}`
        };

        setProjects([newProject, ...projects]);
        setCreateName('');
        setCreateDesc('');
        setError('');
    };

    const handleJoinProject = (e) => {
        e.preventDefault();
        if (!joinKey.trim()) return;

        const newProject = {
            id: Date.now(),
            name: `Joined Project (${joinKey})`,
            description: "You joined this project via a key.",
            created_at: new Date().toISOString(),
            owner_id: "other_user",
            join_key: joinKey
        };

        setProjects([newProject, ...projects]);
        setJoinKey('');
        setError('');
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <SideBar
                user={CURRENT_USER}
                activeProjects={projects}
                onSignOut={() => onLogout(false)}
                currentView={currentView}
                onViewChange={setCurrentView}
                onProjectClick={(id) => console.log("Clicked sidebar project", id)}
            />
            <div className="flex-1 bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 dark:from-blue-100 dark:via-white-200 dark:to-blue-100 overflow-auto min-h-screen">
                <div className="max-w-7xl mx-auto p-8">

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Welcome back, {CURRENT_USER.name}!
                        </h1>
                        <p className="text-gray-600">Manage your projects and collaborate with your team</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Plus className="text-blue-600" size={22} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Create New Project</h2>
                                    <p className="text-sm text-gray-500">Start a new project and invite your team</p>
                                </div>
                            </div>
                            <form onSubmit={handleCreateProject} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Project Name</label>
                                    <input
                                        type="text"
                                        value={createName}
                                        onChange={(e) => setCreateName(e.target.value)}
                                        placeholder="My Awesome Project"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Description
                                    </label>
                                    <textarea
                                        value={createDesc}
                                        onChange={(e) => setCreateDesc(e.target.value)}
                                        placeholder="What's this project about?"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                                        rows={3}
                                    />
                                </div>
                                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                                    <Plus size={16} /> Create Project
                                </button>
                            </form>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Key className="text-green-600" size={22} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Join Project</h2>
                                    <p className="text-sm text-gray-500">Enter a join key to join an existing project</p>
                                </div>
                            </div>
                            <form onSubmit={handleJoinProject} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Join Key</label>
                                    <input
                                        type="text"
                                        value={joinKey}
                                        onChange={(e) => setJoinKey(e.target.value)}
                                        placeholder="Enter project join key"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                    />
                                </div>
                                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                                    <ArrowRight size={16} /> Join Project
                                </button>
                            </form>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Your Projects</h2>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                {projects.length} {projects.length === 1 ? 'Project' : 'Projects'}
                            </span>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse h-48">
                                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                ))}
                            </div>
                        ) : projects.length === 0 ? (
                            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <PlusCircle className="text-gray-400" size={32} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
                                <p className="text-gray-500">Create your first project or join an existing one to get started</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
                                        onClick={() => console.log("Clicked project", project.id)}
                                    >
                                        <div className="mb-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900 truncate pr-2">
                                                    {project.name}
                                                </h3>
                                                <Layout size={18} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                                            </div>
                                            <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
                                                {project.description || 'No description provided'}
                                            </p>
                                        </div>

                                        <div className="space-y-3 pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Calendar size={14} />
                                                <span>Created {formatDate(project.created_at)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <User size={14} />
                                                <span>{project.owner_id === CURRENT_USER.id ? 'You are the owner' : 'Member'}</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-2 py-1.5 rounded border border-gray-100">
                                                    <Key size={14} />
                                                    <code className="flex-1 truncate font-mono text-blue-600">{project.join_key}</code>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        copyJoinKey(project.join_key);
                                                    }}
                                                    className="p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-500 hover:text-gray-700"
                                                    title="Copy join key"
                                                >
                                                    {copiedKey === project.join_key ? (
                                                        <Check size={14} className="text-green-600" />
                                                    ) : (
                                                        <Copy size={14} />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}