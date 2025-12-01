import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    User,
    Key,
    Settings,
    Users,
    MessageSquare,
    Clock,
    CheckCircle2,
    Circle,
    Plus,
    Trash2,
    Link as LinkIcon,
    FileText,
    Download,
    ExternalLink,
    Paperclip
} from 'lucide-react';
import SideBar from '../components/sideBar';

const INITIAL_TASKS = [
    { id: 1, title: "Initialize React Repo", assignedTo: "Dan", completed: true },
    { id: 2, title: "Configure Tailwind CSS", assignedTo: "Dan", completed: true },
    { id: 3, title: "Design Sidebar Component", assignedTo: "Sarah", completed: false },
    { id: 4, title: "Connect Fake Database", assignedTo: "Sarah", completed: false },
];

const INITIAL_LINKS = [
    { id: 1, title: "Figma Design", url: "https://figma.com" },
    { id: 2, title: "API Documentation", url: "https://docs.api.com" },
];

const INITIAL_FILES = [
    { id: 1, name: "Project_Specs.pdf", size: "2.4 MB", type: "pdf" },
    { id: 2, name: "assets_v1.zip", size: "14 MB", type: "zip" },
];

function ProjectPage({ onLogout }) {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { id } = useParams();
    const project = state?.project;

    const [tasks, setTasks] = useState(INITIAL_TASKS);
    const [newTask, setNewTask] = useState('');
    const [links, setLinks] = useState(INITIAL_LINKS);
    const [files, setFiles] = useState(INITIAL_FILES);
    const [newLinkTitle, setNewLinkTitle] = useState('');
    const [newLinkUrl, setNewLinkUrl] = useState('');

    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    // --- Handlers ---
    const handleToggleTask = (taskId) => {
        setTasks(tasks.map(t => 
            t.id === taskId ? { ...t, completed: !t.completed } : t
        ));
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        const task = {
            id: Date.now(),
            title: newTask,
            assignedTo: "Unassigned", // Default for now
            completed: false
        };
        setTasks([...tasks, task]);
        setNewTask('');
    };

    const handleDeleteTask = (taskId) => {
        setTasks(tasks.filter(t => t.id !== taskId));
    };

    const handleAddLink = (e) => {
        e.preventDefault();
        if (!newLinkTitle.trim() || !newLinkUrl.trim()) return;
        setLinks([...links, { id: Date.now(), title: newLinkTitle, url: newLinkUrl }]);
        setNewLinkTitle('');
        setNewLinkUrl('');
    };

    // Fallback if no project data exists
    if (!project) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Project Not Found</h2>
                    <button onClick={() => navigate('/home')} className="text-blue-600 hover:underline mt-2">
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
        <div className="flex h-screen overflow-hidden bg-gray-50">
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
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                                <Plus size={18} />
                                <span>Invite</span>
                            </button>
                            <button className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                                <Settings size={18} />
                            </button>
                        </div>
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
                <div className="max-w-7xl mx-auto p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* Stats & Gauge Row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Completion Gauge */}
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between relative overflow-hidden">
                                    <div className="z-10">
                                        <p className="text-sm text-gray-500 mb-1">Progress</p>
                                        <h3 className="text-2xl font-bold text-gray-900">{progressPercentage}%</h3>
                                        <p className="text-xs text-gray-400 mt-1">{completedTasks}/{totalTasks} tasks</p>
                                    </div>
                                    {/* SVG Circular Progress */}
                                    <div className="relative w-16 h-16">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100" />
                                            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent"
                                                strokeDasharray={175}
                                                strokeDashoffset={175 - (progressPercentage / 100) * 175}
                                                className={`text-blue-600 transition-all duration-1000 ease-out`}
                                            />
                                        </svg>
                                    </div>
                                </div>

                                {/* Other Stats */}
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
                            </div>

                            {/* --- TASKS SECTION --- */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-gray-900">Project Tasks</h3>
                                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                        {tasks.length - completedTasks} Remaining
                                    </span>
                                </div>
                                
                                <div className="p-6 space-y-4">
                                    {/* Task List */}
                                    <div className="space-y-3">
                                        {tasks.map(task => (
                                            <div key={task.id} className="group flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <button 
                                                        onClick={() => handleToggleTask(task.id)}
                                                        className={`transition-colors ${task.completed ? 'text-green-500' : 'text-gray-300 hover:text-gray-400'}`}
                                                    >
                                                        {task.completed ? <CheckCircle2 size={22} className="fill-green-100" /> : <Circle size={22} />}
                                                    </button>
                                                    <div>
                                                        <p className={`text-sm font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                                            {task.title}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center text-[10px] text-purple-600 font-bold">
                                                                {task.assignedTo.charAt(0)}
                                                            </div>
                                                            <p className="text-xs text-gray-500">{task.assignedTo}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => handleDeleteTask(task.id)}
                                                    className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add Task Input */}
                                    <form onSubmit={handleAddTask} className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                            <Plus size={18} className="text-blue-600" />
                                        </div>
                                        <input
                                            type="text"
                                            value={newTask}
                                            onChange={(e) => setNewTask(e.target.value)}
                                            placeholder="Add a new task..."
                                            className="flex-1 bg-transparent text-sm focus:outline-none placeholder-gray-400"
                                        />
                                        <button 
                                            type="submit" 
                                            disabled={!newTask.trim()}
                                            className="text-xs font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Add
                                        </button>
                                    </form>
                                </div>
                            </div>
                            
                            {/* Project Activity*/}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <MessageSquare size={20} className="text-gray-400" />
                                    <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                                </div>
                                <div className="space-y-6 pl-2 border-l-2 border-gray-100 ml-2">
                                    <div className="relative pl-6">
                                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-white"></div>
                                        <p className="text-sm text-gray-600"><span className="font-semibold text-gray-900">Dan</span> created task "Design Sidebar"</p>
                                        <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                                    </div>
                                    <div className="relative pl-6">
                                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-green-500 border-4 border-white"></div>
                                        <p className="text-sm text-gray-600"><span className="font-semibold text-gray-900">Sarah</span> completed "API Setup"</p>
                                        <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            
                            {/* Team Card */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Team</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">TU</div>
                                        <div>
                                            <p className="text-sm font-medium">Test User 1</p>
                                            <p className="text-xs text-gray-500">Owner</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold">JD</div>
                                        <div>
                                            <p className="text-sm font-medium">Jane Doe</p>
                                            <p className="text-xs text-gray-500">Editor</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shared Links */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <LinkIcon size={18} /> Shared Links
                                </h3>
                                <div className="space-y-3 mb-4">
                                    {links.map(link => (
                                        <a 
                                            key={link.id} 
                                            href={link.url} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                                        >
                                            <div className="flex items-center gap-2 truncate">
                                                <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                                                    <ExternalLink size={12} />
                                                </div>
                                                <span className="text-sm font-medium text-gray-700 truncate">{link.title}</span>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                                {/* Simple Add Link Form */}
                                <form onSubmit={handleAddLink} className="space-y-2">
                                    <input 
                                        type="text" 
                                        placeholder="Link Title" 
                                        value={newLinkTitle}
                                        onChange={e => setNewLinkTitle(e.target.value)}
                                        className="w-full text-xs p-2 border border-gray-200 rounded focus:outline-none focus:border-blue-500"
                                    />
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="https://..." 
                                            value={newLinkUrl}
                                            onChange={e => setNewLinkUrl(e.target.value)}
                                            className="flex-1 text-xs p-2 border border-gray-200 rounded focus:outline-none focus:border-blue-500"
                                        />
                                        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Files */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Paperclip size={18} /> Files
                                    </h3>
                                    <button className="text-xs text-blue-600 font-medium hover:underline">View All</button>
                                </div>
                                
                                <div className="space-y-3">
                                    {files.map(file => (
                                        <div key={file.id} className="flex items-center justify-between group">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="w-8 h-8 rounded bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0">
                                                    <FileText size={16} />
                                                </div>
                                                <div className="truncate">
                                                    <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                                                    <p className="text-xs text-gray-500">{file.size}</p>
                                                </div>
                                            </div>
                                            <button className="text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all">
                                                <Download size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <button className="w-full mt-6 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-2">
                                    <Plus size={16} /> Upload File
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectPage;