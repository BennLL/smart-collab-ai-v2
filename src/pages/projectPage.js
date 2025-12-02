import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft, Calendar, User, Key, Users, Clock,
    CheckCircle2, Circle, Plus, Trash2, Link as LinkIcon, FileText,
    Download, ExternalLink, Paperclip, BarChart3, AlertCircle, 
    Bot, Languages, CalendarCheck, Zap
} from 'lucide-react';
import SideBar from '../components/sideBar';

// --- 1. MOCK DATA CONSTANTS ---
const CURRENT_USER = { name: "You", email: "you@example.com" };

const TEAM_MEMBERS = [
    { id: 'u1', name: 'Dan', email: 'dan@example.com' },
    { id: 'u2', name: 'Sarah', email: 'sarah@example.com' },
    { id: 'u3', name: 'Mike', email: 'mike@example.com' }
];

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

// Mock AI Response Data
const MOCK_AI_ANALYSIS = {
    integrityScore: 92,
    freeloaderRisk: "Low",
    sentiment: "Positive",
    summary: "Team workflow is efficient. Dan is leading technical setup. Sarah is blocked on DB connection—suggest intervention if not resolved by Friday.",
    jargonTranslations: [
        { term: "LGTM", meaning: "Looks Good To Me (Approval)" },
        { term: "PR", meaning: "Pull Request (Code submission)" }
    ],
    nextMeeting: "Wednesday, 2:00 PM EST (Optimal for all timezones)",
    interventionLevel: "None"
};

function ProjectPage({ onLogout }) {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { id } = useParams();

    // Use passed project or fallback mock
    const project = state?.project || {
        id: id,
        name: "Mock Project",
        description: "This is a local simulation of the project page.",
        owner_id: "You",
        created_at: new Date().toISOString(),
        join_key: "MOCK-123"
    };

    // --- 2. STATE MANAGEMENT ---
    const [tasks, setTasks] = useState([]);
    const [links, setLinks] = useState([]);
    const [files] = useState(INITIAL_FILES);
    const [team] = useState(TEAM_MEMBERS);
    const [isLoaded, setIsLoaded] = useState(false);
    
    // AI State
    const [aiLoading, setAiLoading] = useState(false);
    const [aiData, setAiData] = useState(null);

    // Form States
    const [newTask, setNewTask] = useState('');
    const [assignee, setAssignee] = useState(TEAM_MEMBERS[0].name);
    const [newLinkTitle, setNewLinkTitle] = useState('');
    const [newLinkUrl, setNewLinkUrl] = useState('');

    // --- 3. PERSISTENCE LOGIC ---
    useEffect(() => {
        setIsLoaded(false);
        const savedTasks = localStorage.getItem(`tasks_${id}`);
        const savedLinks = localStorage.getItem(`links_${id}`);

        if (savedTasks) setTasks(JSON.parse(savedTasks));
        else setTasks(INITIAL_TASKS);

        if (savedLinks) setLinks(JSON.parse(savedLinks));
        else setLinks(INITIAL_LINKS);

        setIsLoaded(true);
    }, [id]);

    useEffect(() => {
        if (isLoaded) localStorage.setItem(`tasks_${id}`, JSON.stringify(tasks));
    }, [tasks, id, isLoaded]);

    useEffect(() => {
        if (isLoaded) localStorage.setItem(`links_${id}`, JSON.stringify(links));
    }, [links, id, isLoaded]);

    // Simulate AI Analysis Loading
    const runAiAnalysis = () => {
        setAiLoading(true);
        setTimeout(() => {
            setAiData(MOCK_AI_ANALYSIS);
            setAiLoading(false);
        }, 1500);
    };

    // Auto-run AI on load (or when tasks change significanty - simplified here)
    useEffect(() => {
        if(isLoaded && !aiData) {
            runAiAnalysis();
        }
    }, [isLoaded]);

    // --- HELPER ---
    const ensureProtocol = (url) => {
        if (!url) return '';
        if (url.match(/^https?:\/\//)) return url;
        return `https://${url}`;
    };

    // --- STATS ---
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    const contributionStats = team.map(member => {
        const memberTasks = tasks.filter(t => t.assignedTo === member.name);
        const completed = memberTasks.filter(t => t.completed).length;
        const total = memberTasks.length;
        const overallContribution = totalTasks === 0 ? 0 : Math.round((completed / totalTasks) * 100);

        return {
            id: member.id,
            name: member.name,
            completed,
            total,
            overallContribution,
            hasTasks: total > 0
        };
    }).sort((a, b) => b.overallContribution - a.overallContribution);

    // --- HANDLERS ---
    const handleToggleTask = (taskId) => {
        setTasks(prev => prev.map(t => 
            t.id === taskId ? { ...t, completed: !t.completed } : t
        ));
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        const task = { id: Date.now(), title: newTask, assignedTo: assignee, completed: false };
        setTasks(prev => [...prev, task]);
        setNewTask('');
    };

    const handleDeleteTask = (taskId) => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
    };

    const handleAddLink = (e) => {
        e.preventDefault();
        if (!newLinkTitle.trim() || !newLinkUrl.trim()) return;
        const link = { id: Date.now(), title: newLinkTitle, url: ensureProtocol(newLinkUrl) };
        setLinks(prev => [...prev, link]);
        setNewLinkTitle('');
        setNewLinkUrl('');
    };

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

    if (!isLoaded) return <div className="flex h-screen items-center justify-center">Loading...</div>;

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <SideBar user={CURRENT_USER} activeProjects={[project]} onSignOut={() => onLogout && onLogout(false)} currentView="projects" />

            <div className="flex-1 overflow-auto bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-8 py-6">
                    <button onClick={() => navigate('/home')} className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4">
                        <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
                    </button>
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
                            <p className="text-gray-600 max-w-2xl">{project.description}</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                                <Plus size={18} /> <span>Invite</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 mt-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2"><User size={16} /> <span>Owner: {project.owner_id}</span></div>
                        <div className="flex items-center gap-2"><Calendar size={16} /> <span>Created: {formatDate(project.created_at)}</span></div>
                        <div className="flex items-center gap-2"><Key size={16} /> <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700">{project.join_key}</span></div>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="max-w-7xl mx-auto p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* LEFT COLUMN */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between relative overflow-hidden">
                                    <div className="z-10">
                                        <p className="text-sm text-gray-500 mb-1">Progress</p>
                                        <h3 className="text-2xl font-bold text-gray-900">{progressPercentage}%</h3>
                                        <p className="text-xs text-gray-400 mt-1">{completedTasks}/{totalTasks} tasks</p>
                                    </div>
                                    <div className="relative w-16 h-16">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100" />
                                            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent"
                                                strokeDasharray={175} strokeDashoffset={175 - (progressPercentage / 100) * 175}
                                                className="text-blue-600 transition-all duration-1000 ease-out"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1"><Clock size={18} /> <span className="text-sm">Hours</span></div>
                                    <p className="text-2xl font-bold text-gray-900">12.5</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1"><Users size={18} /> <span className="text-sm">Team</span></div>
                                    <p className="text-2xl font-bold text-gray-900">{team.length}</p>
                                </div>
                            </div>

                            {/* Tasks Section */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-gray-900">Project Tasks</h3>
                                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">{tasks.length - completedTasks} Remaining</span>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="space-y-3">
                                        {tasks.map(task => (
                                            <div key={task.id} className="group flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => handleToggleTask(task.id)} className={task.completed ? 'text-green-500' : 'text-gray-300 hover:text-gray-400'}>
                                                        {task.completed ? <CheckCircle2 size={22} className="fill-green-100" /> : <Circle size={22} />}
                                                    </button>
                                                    <div>
                                                        <p className={`text-sm font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{task.title}</p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center text-[10px] text-purple-600 font-bold">{(task.assignedTo || 'U').charAt(0)}</div>
                                                            <p className="text-xs text-gray-500">{task.assignedTo || 'Unassigned'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button onClick={() => handleDeleteTask(task.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                                            </div>
                                        ))}
                                    </div>
                                    <form onSubmit={handleAddTask} className="mt-4 pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0"><Plus size={18} className="text-blue-600" /></div>
                                            <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Add a new task..." className="flex-1 bg-transparent text-sm focus:outline-none placeholder-gray-400" />
                                        </div>
                                        <div className="flex justify-end gap-2 mt-2">
                                            <select value={assignee} onChange={(e) => setAssignee(e.target.value)} className="text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1 focus:border-blue-500">
                                                {team.map(member => <option key={member.id} value={member.name}>{member.name}</option>)}
                                            </select>
                                            <button type="submit" disabled={!newTask.trim()} className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50">Add Task</button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* --- AI ANALYSIS SECTION --- */}
                            <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl shadow-lg border border-indigo-700 overflow-hidden text-white relative">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><Bot size={120} /></div>
                                
                                <div className="p-6 border-b border-indigo-700/50 flex justify-between items-center relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-indigo-400/30">
                                            <Bot className="text-indigo-300" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">SmartCollab AI Analysis</h3>
                                            <p className="text-xs text-indigo-200">Real-time workflow & accountability monitoring</p>
                                        </div>
                                    </div>
                                    <button onClick={runAiAnalysis} className="text-xs bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1">
                                        <Zap size={14} /> Refresh Analysis
                                    </button>
                                </div>

                                {aiLoading ? (
                                    <div className="p-12 text-center text-indigo-300 animate-pulse">
                                        Analyzing contribution metrics and communication patterns...
                                    </div>
                                ) : aiData ? (
                                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                        
                                        {/* 1. Contribution Integrity */}
                                        <div className="bg-indigo-950/50 rounded-lg p-4 border border-indigo-500/30 backdrop-blur-sm">
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="text-sm font-semibold text-indigo-100 flex items-center gap-2">
                                                    <BarChart3 size={16} /> Contribution Integrity
                                                </h4>
                                                <span className={`text-xs px-2 py-0.5 rounded-full border ${aiData.integrityScore > 90 ? 'bg-green-500/20 border-green-500/50 text-green-300' : 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300'}`}>
                                                    Score: {aiData.integrityScore}/100
                                                </span>
                                            </div>
                                            <p className="text-xs text-indigo-200 mb-3">
                                                Analyzes commit history, task complexity, and time-to-completion to detect free-riding.
                                            </p>
                                            <div className="flex items-center gap-2 text-xs">
                                                <div className="flex-1 bg-indigo-900 rounded-full h-2 overflow-hidden">
                                                    <div className="bg-green-400 h-full rounded-full" style={{ width: `${aiData.integrityScore}%` }}></div>
                                                </div>
                                                <span className="text-green-300 font-mono">{aiData.freeloaderRisk} Risk</span>
                                            </div>
                                        </div>

                                        {/* 2. Intervention Alert */}
                                        <div className="bg-indigo-950/50 rounded-lg p-4 border border-indigo-500/30 backdrop-blur-sm">
                                            <h4 className="text-sm font-semibold text-indigo-100 flex items-center gap-2 mb-2">
                                                <AlertCircle size={16} className="text-orange-400" /> Intervention Monitor
                                            </h4>
                                            <p className="text-xs text-indigo-200 leading-relaxed">
                                                {aiData.summary}
                                            </p>
                                            {aiData.interventionLevel !== "None" && (
                                                <div className="mt-2 text-xs bg-red-500/20 text-red-200 px-2 py-1 rounded border border-red-500/30 inline-block">
                                                    Instructor Alert Recommended
                                                </div>
                                            )}
                                        </div>

                                        {/* 3. Communication & Jargon */}
                                        <div className="bg-indigo-950/50 rounded-lg p-4 border border-indigo-500/30 backdrop-blur-sm">
                                            <h4 className="text-sm font-semibold text-indigo-100 flex items-center gap-2 mb-3">
                                                <Languages size={16} /> Cross-Language Jargon
                                            </h4>
                                            <div className="space-y-2">
                                                {aiData.jargonTranslations.map((item, i) => (
                                                    <div key={i} className="text-xs flex justify-between border-b border-indigo-800/50 pb-1 last:border-0">
                                                        <span className="font-mono text-purple-300">{item.term}</span>
                                                        <span className="text-indigo-200">{item.meaning}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* 4. Smart Scheduling */}
                                        <div className="bg-indigo-950/50 rounded-lg p-4 border border-indigo-500/30 backdrop-blur-sm">
                                            <h4 className="text-sm font-semibold text-indigo-100 flex items-center gap-2 mb-2">
                                                <CalendarCheck size={16} /> Smart Scheduler
                                            </h4>
                                            <p className="text-xs text-indigo-200 mb-2">
                                                Analyzed team calendars and timezones for optimal overlap.
                                            </p>
                                            <div className="bg-indigo-900/50 p-2 rounded text-xs text-center font-medium text-white border border-indigo-700">
                                                {aiData.nextMeeting}
                                            </div>
                                        </div>

                                    </div>
                                ) : null}
                            </div>

                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="space-y-6">
                            
                            {/* Work Contribution */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <BarChart3 size={18} className="text-purple-600" /> Work Contribution
                                </h3>
                                <div className="space-y-4">
                                    {contributionStats.map((stat) => (
                                        <div key={stat.id} className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-medium text-gray-700">{stat.name}</span>
                                                <span className="text-gray-500">{stat.completed}/{stat.total} tasks</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div 
                                                    style={{ width: `${stat.overallContribution}%` }}
                                                    className={`h-full rounded-full ${stat.overallContribution > 40 ? 'bg-green-500' : stat.overallContribution > 20 ? 'bg-blue-500' : stat.hasTasks ? 'bg-orange-400' : 'bg-gray-300'}`}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Team Members */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h3>
                                <div className="space-y-3">
                                    {team.map((member) => (
                                        <div key={member.id} className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold">{member.name.charAt(0)}</div>
                                            <div>
                                                <p className="text-sm font-medium">{member.name}</p>
                                                <p className="text-xs text-gray-500">Member</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shared Links */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><LinkIcon size={18} /> Shared Links</h3>
                                <div className="space-y-3 mb-4">
                                    {links.map(link => (
                                        <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <div className="flex items-center gap-2 truncate">
                                                <ExternalLink size={12} className="text-blue-600" />
                                                <span className="text-sm font-medium text-gray-700 truncate">{link.title}</span>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                                <form onSubmit={handleAddLink} className="space-y-2">
                                    <input type="text" placeholder="Title" value={newLinkTitle} onChange={e => setNewLinkTitle(e.target.value)} className="w-full text-xs p-2 border border-gray-200 rounded" />
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="https://..." value={newLinkUrl} onChange={e => setNewLinkUrl(e.target.value)} className="flex-1 text-xs p-2 border border-gray-200 rounded" />
                                        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"><Plus size={14} /></button>
                                    </div>
                                </form>
                            </div>

                            {/* Files */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><Paperclip size={18} /> Files</h3>
                                    <button className="text-xs text-blue-600 hover:underline">View All</button>
                                </div>
                                <div className="space-y-3">
                                    {files.map(file => (
                                        <div key={file.id} className="flex items-center justify-between group">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="w-8 h-8 rounded bg-orange-50 flex items-center justify-center text-orange-600"><FileText size={16} /></div>
                                                <div className="truncate">
                                                    <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                                                    <p className="text-xs text-gray-500">{file.size}</p>
                                                </div>
                                            </div>
                                            <button className="text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all"><Download size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-6 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:bg-gray-50"><Plus size={16} /> Upload File</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectPage;