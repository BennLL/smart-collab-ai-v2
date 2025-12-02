import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft, Calendar, User, Key, Settings, Users, MessageSquare, Clock,
    CheckCircle2, Circle, Plus, Trash2, Link as LinkIcon, FileText,
    Download, ExternalLink, Paperclip, BarChart3, AlertCircle
} from 'lucide-react';
import SideBar from '../components/sideBar';
import { supabase } from '../supabaseClient';

function ProjectPage({ onLogout }) {

    const [tasks, setTasks] = useState([]);
    const [links, setLinks] = useState([]);
    const [files, setFiles] = useState([]);
    const [team, setTeam] = useState([]);     // ALWAYS ARRAY
    const [project, setProject] = useState(null);
    const navigate = useNavigate();
    const { state } = useLocation();
    const { id } = useParams();

    const [newTask, setNewTask] = useState('');
    const [assignee, setAssignee] = useState('');
    const [newLinkTitle, setNewLinkTitle] = useState('');
    const [newLinkUrl, setNewLinkUrl] = useState('');

    useEffect(() => {
        const loadProject = async () => {
            // Fetch Project
            const { data: proj } = await supabase
                .from('projects')
                .select('*')
                .eq('id', id)
                .single();

            setProject(proj);

            // Fetch Tasks
            const { data: projTasks } = await supabase
                .from('tasks')
                .select('*')
                .eq('project_id', id);

            setTasks(projTasks || []);

            // Fetch Links
            const { data: projLinks } = await supabase
                .from('project_links')
                .select('*')
                .eq('project_id', id);

            setLinks(projLinks || []);

            // Fetch Files
            const { data: projFiles } = await supabase
                .from('project_files')
                .select('*')
                .eq('project_id', id);

            setFiles(projFiles || []);

            // Fetch Team Members
            const { data: members } = await supabase
                .from('project_members')
                .select('profiles(name, email)')
                .eq('project_id', id);

            // FIX: always return an array
            const teamList = members?.map(m => m.profiles?.name || "Unknown") || [];
            setTeam(teamList);

            // Set default assignee to first team member
            if (teamList.length > 0) setAssignee(teamList[0]);
        };

        loadProject();
    }, [id]);

    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    const progressPercentage =
        totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    const contributionStats = team.map(member => {
        const memberTasks = tasks.filter(t => t.assigned_to === member);
        const completed = memberTasks.filter(t => t.completed).length;
        const total = memberTasks.length;

        return {
            name: member,
            completed,
            total,
            overallContribution:
                totalTasks === 0 ? 0 : Math.round((completed / totalTasks) * 100),
            hasTasks: total > 0
        };
    }).sort((a, b) => b.overallContribution - a.overallContribution);

    const handleToggleTask = async (taskId) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const { data } = await supabase
            .from('tasks')
            .update({ completed: !task.completed })
            .eq('id', taskId)
            .select()
            .single();

        setTasks(tasks.map(t => t.id === taskId ? data : t));
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        const { data: task } = await supabase
            .from('tasks')
            .insert({
                project_id: id,
                title: newTask,
                assigned_to: assignee
            })
            .select()
            .single();

        setTasks([...tasks, task]);
        setNewTask('');
    };

    const handleDeleteTask = async (taskId) => {
        await supabase.from('tasks').delete().eq('id', taskId);
        setTasks(tasks.filter(t => t.id !== taskId));
    };

    const handleAddLink = async (e) => {
        e.preventDefault();
        const { data: link } = await supabase
            .from('project_links')
            .insert({
                project_id: id,
                title: newLinkTitle,
                url: newLinkUrl
            })
            .select()
            .single();

        setLinks([...links, link]);
        setNewLinkTitle('');
        setNewLinkUrl('');
    };

    if (!project) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Project Not Found</h2>
                    <button
                        onClick={() => navigate('/home')}
                        className="text-blue-600 hover:underline mt-2"
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
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <SideBar
                user={{ name: "User", email: "user@example.com" }}
                activeProjects={[project]}
                onSignOut={() => onLogout && onLogout(false)}
                currentView="projects"
                onProjectClick={() => { }}
            />

            <div className="flex-1 overflow-auto bg-gray-50">

                {/* HEADER */}
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

                {/* MAIN CONTENT */}
                <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* COL 1 & 2: Task + Stats */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Progress Gauge */}
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Progress</p>
                                    <h3 className="text-2xl font-bold text-gray-900">{progressPercentage}%</h3>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {completedTasks}/{totalTasks} tasks
                                    </p>
                                </div>
                                <div className="relative w-16 h-16">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100" />
                                        <circle
                                            cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6"
                                            fill="transparent"
                                            strokeDasharray={175}
                                            strokeDashoffset={175 - (progressPercentage / 100) * 175}
                                            className="text-blue-600 transition-all duration-1000 ease-out"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Hours */}
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-2 text-gray-500 mb-1">
                                    <Clock size={18} />
                                    <span className="text-sm">Hours Logged</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">12.5</p>
                            </div>

                            {/* Members */}
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-2 text-gray-500 mb-1">
                                    <Users size={18} />
                                    <span className="text-sm">Team Members</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{team.length}</p>
                            </div>
                        </div>

                        {/* Tasks List */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-900">Project Tasks</h3>
                                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                    {tasks.length - completedTasks} Remaining
                                </span>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="space-y-3">
                                    {tasks.map(task => (
                                        <div key={task.id} className="group flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => handleToggleTask(task.id)}
                                                    className={task.completed ? 'text-green-500' : 'text-gray-300 hover:text-gray-400'}
                                                >
                                                    {task.completed
                                                        ? <CheckCircle2 size={22} className="fill-green-100" />
                                                        : <Circle size={22} />}
                                                </button>

                                                <div>
                                                    <p className={`text-sm font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                                        {task.title}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center text-[10px] text-purple-600 font-bold">
                                                            {task.assigned_to?.charAt(0)}
                                                        </div>
                                                        <p className="text-xs text-gray-500">{task.assigned_to}</p>
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

                                {/* Add Task */}
                                <form onSubmit={handleAddTask} className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                            <Plus size={18} className="text-blue-600" />
                                        </div>
                                        <input
                                            type="text"
                                            value={newTask}
                                            onChange={(e) => setNewTask(e.target.value)}
                                            placeholder="Add a new task..."
                                            className="flex-1 bg-transparent text-sm focus:outline-none"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2 mt-2">
                                        <select
                                            value={assignee}
                                            onChange={(e) => setAssignee(e.target.value)}
                                            className="text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1 text-gray-600 focus:border-blue-500"
                                        >
                                            {team.map(member => (
                                                <option key={member} value={member}>{member}</option>
                                            ))}
                                        </select>
                                        <button
                                            type="submit"
                                            disabled={!newTask.trim()}
                                            className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            Add Task
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* COL 3 RIGHT — Contributions, Team, Links, Files */}
                    <div className="space-y-6">

                        {/* Contribution Breakdown */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <BarChart3 size={18} className="text-purple-600" />
                                Work Contribution
                            </h3>

                            <div className="space-y-4">
                                {contributionStats.map((stat, index) => (
                                    <div key={index} className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium text-gray-700">{stat.name}</span>
                                            <span className="text-gray-500">{stat.completed}/{stat.total} tasks</span>
                                        </div>

                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                style={{ width: `${stat.overallContribution}%` }}
                                                className={`h-full rounded-full ${
                                                    stat.overallContribution > 40 ? 'bg-green-500'
                                                    : stat.overallContribution > 20 ? 'bg-blue-500'
                                                    : stat.hasTasks ? 'bg-orange-400'
                                                    : 'bg-gray-300'
                                                }`}
                                            ></div>
                                        </div>

                                        {!stat.hasTasks && (
                                            <div className="flex items-center gap-1 text-[10px] text-red-500 mt-0.5">
                                                <AlertCircle size={10} />
                                                <span>No tasks assigned</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-3 border-t border-gray-50 text-xs text-gray-400 text-center">
                                % of total completed project tasks
                            </div>
                        </div>

                        {/* Team */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h3>
                            <div className="space-y-3">
                                {team.map((member, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold">
                                            {member.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{member}</p>
                                            <p className="text-xs text-gray-500">Member</p>
                                        </div>
                                    </div>
                                ))}
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
                                        className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-2 truncate">
                                            <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-blue-600">
                                                <ExternalLink size={12} />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 truncate">
                                                {link.title}
                                            </span>
                                        </div>
                                    </a>
                                ))}
                            </div>

                            {/* Add Link */}
                            <form onSubmit={handleAddLink} className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="Link Title"
                                    value={newLinkTitle}
                                    onChange={(e) => setNewLinkTitle(e.target.value)}
                                    className="w-full text-xs p-2 border border-gray-200 rounded focus:outline-none focus:border-blue-500"
                                />
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="https://..."
                                        value={newLinkUrl}
                                        onChange={(e) => setNewLinkUrl(e.target.value)}
                                        className="flex-1 text-xs p-2 border border-gray-200 rounded focus:outline-none focus:border-blue-500"
                                    />
                                    <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
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
                                <button className="text-xs text-blue-600 hover:underline">View All</button>
                            </div>

                            <div className="space-y-3">
                                {files.map(file => (
                                    <div key={file.id} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-8 h-8 rounded bg-orange-50 flex items-center justify-center text-orange-600">
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

                            <button className="w-full mt-6 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:bg-gray-50">
                                <Plus size={16} /> Upload File
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectPage;
