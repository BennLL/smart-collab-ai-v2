import { Home, FolderKanban, Settings, LogOut, Layout } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../img/logo.png';
import { supabase } from '../supabaseClient';

const menuItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/home' },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'settings', label: 'Settings', icon: Settings },
];

const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
};

function SideBar({
    user,
    activeProjects = [],
    onSignOut,
    currentView = 'home',
    onViewChange,
    onProjectClick
}) {
    const navigate = useNavigate();

    const handleNavigation = (item) => {
        if (item.id === 'home') {
            navigate('/home');
        }

        if (onViewChange) {
            onViewChange(item.id);
        }
    };

    const handleSidebarProjectClick = (project) => {
        navigate(`/project/${project.id}`, { state: { project } });

        if (onProjectClick) {
            onProjectClick(project.id);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();             
        localStorage.removeItem('supabase.auth.token'); 
        navigate('/login');
    };

    return (
        <div className="w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white h-screen flex flex-col shadow-xl flex-shrink-0">
            <div className="p-6 border-b border-gray-700">
                <div className="flex items-center gap-3">
                    <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer "
                        onClick={() => navigate('/home')}
                    >
                        <Layout className="w-7 h-7 text-white" />
                        <img src={logo}></img>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">Smart Collab</h1>
                        <p className="text-xs text-gray-400">Manage with ease</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleNavigation(item)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    );
                })}

                <div className="pt-6 pb-3">
                    <div className="flex items-center justify-between px-4 mb-3">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Active Projects
                        </h3>
                        <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full">
                            {activeProjects.length}
                        </span>
                    </div>
                    <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
                        {activeProjects.length === 0 ? (
                            <p className="text-sm text-gray-500 px-4 py-2">No projects yet</p>
                        ) : (
                            activeProjects.map((project) => (
                                <button
                                    key={project.id}
                                    onClick={() => handleSidebarProjectClick(project)}
                                    className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 truncate"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                                        <span className="truncate">{project.name}</span>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </nav>

            <div className="p-4 border-t border-gray-700">
                <div className="flex items-center gap-3 mb-3 p-3 bg-gray-700/50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center font-semibold text-sm shadow-lg">
                        {getInitials(user?.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                            {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{user?.email || 'user@example.com'}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
}

export default SideBar;