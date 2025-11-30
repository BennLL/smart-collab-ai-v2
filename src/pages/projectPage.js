import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    User,
    Key,
    Settings,
    Users,
    MessageSquare,
    Clock
} from 'lucide-react';
import SideBar from '../components/sideBar';

function ProjectPage({ onLogout }) {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { id } = useParams();

    const project = state?.project;

    // Fallback if no project data exists
    if (!project) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Project Not Found</h2>
                    <p className="text-gray-500 mb-4">We couldn't load the project data.</p>
                    <button
                        onClick={() => navigate('/home')}
                        className="text-blue-600 hover:underline"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric'
        });
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 ">
            {/* Reuse Sidebar for consistency */}
            <SideBar
                user={{ name: "User", email: "user@example.com" }} 
                activeProjects={[project]} 
                onSignOut={() => onLogout && onLogout(false)}
                currentView="projects"
                onProjectClick={() => { }} 
            />

            <div className="flex-1 overflow-auto bg-gray-50">
                {/* Header Banner */}
                <div className="bg-white border-b border-gray-200 px-8 py-6">
                    <button
                        onClick={() => navigate('/home')}
                        className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
                    </button>

                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
                            <p className="text-gray-600 max-w-2xl">{project.description}</p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                            <Settings size={18} />
                            <span>Settings</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-6 mt-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <User size={16} />
                            <span>Owner: {project.owner_id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>Created: {formatDate(project.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Key size={16} />
                            <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                                {project.join_key}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="max-w-7xl mx-auto p-8 ">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Main Content Area */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <Clock size={18} />
                                        <span className="text-sm">Hours Logged</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">12.5</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <Users size={18} />
                                        <span className="text-sm">Team Members</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">4</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <MessageSquare size={18} />
                                        <span className="text-sm">Comments</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">28</p>
                                </div>
                            </div>

                            {/* Recent Activity Placeholder */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[300px]">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Activity</h3>
                                <div className="space-y-4">
                                    <div className="flex gap-4 pb-4 border-b border-gray-100">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                            B
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-900">
                                                <span className="font-medium">Ben</span> uploaded a new file
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 pb-4 border-b border-gray-100">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs">
                                            S
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-900">
                                                <span className="font-medium">Sarah</span> completed a task
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar Area */}
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Team</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                                        <div>
                                            <p className="text-sm font-medium">Test User 1</p>
                                            <p className="text-xs text-gray-500">Owner</p>
                                        </div>
                                    </div>
                                    <button className="w-full mt-2 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                                        + Invite Member
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectPage;