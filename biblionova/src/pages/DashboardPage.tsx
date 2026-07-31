import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Book, Loan } from '../types';
import { api, ApiError } from '../services/api';
import { adaptBook, adaptEmprunt, BackendBook, BackendEmprunt } from '../services/adapters';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  BookOpen, LayoutDashboard, Clock, History, Library,
  LogOut, Bell, Search, Settings, ChevronDown,
  TrendingUp, TrendingDown, Users, BookMarked,
  CheckCircle, AlertTriangle, Menu, X, User, Bookmark
} from 'lucide-react';

// ── DONNÉES GRAPHIQUES ──
const areaData = [
  { mois: 'Sep', emprunts: 12, retours: 8 },
  { mois: 'Oct', emprunts: 18, retours: 14 },
  { mois: 'Nov', emprunts: 22, retours: 19 },
  { mois: 'Déc', emprunts: 15, retours: 20 },
  { mois: 'Jan', emprunts: 28, retours: 22 },
  { mois: 'Fév', emprunts: 35, retours: 28 },
  { mois: 'Mar', emprunts: 30, retours: 32 },
  { mois: 'Avr', emprunts: 42, retours: 38 },
];

const barData = [
  { genre: 'Roman', livres: 38 },
  { genre: 'Science', livres: 24 },
  { genre: 'Histoire', livres: 31 },
  { genre: 'Philo', livres: 19 },
  { genre: 'Poésie', livres: 14 },
  { genre: 'Conte', livres: 22 },
];

const donutData = [
  { name: 'Retournés', value: 58, color: '#5C8261' },
  { name: 'En cours', value: 28, color: '#7A4F2B' },
  { name: 'En retard', value: 14, color: '#ef4444' },
];

const statusColor: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  returned: 'bg-gray-100 text-gray-500 border-gray-200',
  overdue: 'bg-red-50 text-red-500 border-red-200',
};
const statusLabel: Record<string, string> = {
  active: 'En cours', returned: 'Retourné', overdue: 'En retard',
};

function fmt(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}
function daysLeft(due: string) {
  return Math.ceil((new Date(due).getTime() - Date.now()) / 86400000);
}

type Tab = 'overview' | 'emprunts' | 'historique' | 'catalogue';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [books, setBooks] = useState<Book[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [borrowMsg, setBorrowMsg] = useState('');
  const [borrowError, setBorrowError] = useState('');

  const loadData = () => {
    api.get<BackendBook[]>('/books').then((data) => setBooks(data.map(adaptBook))).catch(() => {});

    Promise.all([
      api.get<BackendEmprunt[]>('/emprunts'),
      api.get<BackendEmprunt[]>('/emprunts/historique'),
    ])
      .then(([enCours, historique]) => {
        setLoans([...enCours, ...historique].map(adaptEmprunt));
      })
      .catch(() => setLoans([]));
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEmprunter = async (bookId: string) => {
    setBorrowMsg('');
    setBorrowError('');
    try {
      await api.post('/emprunts', { book_id: Number(bookId) });
      setBorrowMsg('Livre emprunté avec succès. Retrouvez-le dans l\'onglet "Emprunts".');
      loadData();
    } catch (err) {
      setBorrowError(err instanceof ApiError ? err.message : "Erreur lors de l'emprunt.");
    }
  };

  const active = loans.filter(l => l.status === 'active');
  const overdue = loans.filter(l => l.status === 'overdue');
  const returned = loans.filter(l => l.status === 'returned');

  // Livres actuellement empruntés (statut actif ou en retard) : utilisé pour
  // changer l'affichage du bouton "Emprunter" dans le catalogue.
  const borrowedBookIds = new Set([...active, ...overdue].map(l => l.bookId));

  const statCards = [
    {
      label: 'Total Emprunts',
      value: String(loans.length),
      sub: 'Vos emprunts',
      up: true,
      icon: BookMarked,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
    },
    {
      label: 'Actifs',
      value: String(active.length + overdue.length),
      sub: '+4% vs hier',
      up: true,
      icon: Clock,
      color: 'text-sky-600',
      bg: 'bg-sky-50',
    },
    {
      label: 'Nouveaux membres',
      value: '48',
      sub: '-2% ce mois',
      up: false,
      icon: Users,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Retours actifs',
      value: String(returned.length + 18),
      sub: '+8% ce mois',
      up: true,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
  ];

  const navItems = [
    { id: 'overview' as Tab, label: 'Overview', icon: LayoutDashboard },
    { id: 'emprunts' as Tab, label: 'Emprunts', icon: Clock, badge: overdue.length },
    { id: 'historique' as Tab, label: 'Historique', icon: History },
    { id: 'catalogue' as Tab, label: 'Catalogue', icon: Library },
  ];

  // ── SIDEBAR ──
  const Sidebar = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
        <div className="w-8 h-8 bg-ink-700 rounded-lg flex items-center justify-center">
          <BookOpen size={16} className="text-white" />
        </div>
        <div>
          <span className="font-display font-bold text-ink-800 text-sm">BooKinG</span>
          <span className="block text-[10px] text-gray-400 leading-none">Dashboard</span>
        </div>
      </div>

      {/* Nav principale */}
      <div className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">Menu</p>
        {navItems.map(({ id, label, icon: Icon, badge }) => (
          <button
            key={id}
            onClick={() => { setTab(id); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
              tab === id
                ? 'bg-ink-700 text-white shadow-sm shadow-ink-900/20'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
            }`}
          >
            <Icon size={16} />
            <span className="flex-1">{label}</span>
            {badge ? (
              <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {badge}
              </span>
            ) : null}
          </button>
        ))}

        <div className="pt-4">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">Compte</p>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all text-left">
            <User size={16} /> Mon Profil
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all text-left">
            <Bookmark size={16} /> Favoris
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all text-left">
            <Settings size={16} /> Paramètres
          </button>
        </div>
      </div>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-50 mb-1">
          <div className="w-8 h-8 rounded-full bg-ink-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.name?.[0] ?? 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-gray-700 truncate">{user?.name}</p>
            <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
          </div>
          <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />
        </div>
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
        >
          <LogOut size={14} /> Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50 font-body">
      {/* Sidebar desktop */}
      <aside className="hidden lg:block w-56 xl:w-60 fixed left-0 top-0 h-full z-30 flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Sidebar mobile */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-60 z-50 shadow-xl">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-56 xl:ml-60 flex flex-col min-h-screen">
        {/* ── TOPBAR ── */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 sm:px-6 h-14 flex items-center gap-3">
          <button className="lg:hidden p-1.5 text-gray-500" onClick={() => setSidebarOpen(true)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Breadcrumb */}
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <span className="text-gray-400">BooKinG</span>
            <span className="text-gray-300">/</span>
            <span className="font-medium text-gray-700 capitalize">{tab === 'overview' ? 'Vue d\'ensemble' : tab}</span>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-xs ml-auto sm:ml-4">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Rechercher…"
              className="w-full pl-8 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-ink-400 transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-2">
            <button className="relative p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all">
              <Bell size={17} />
              {overdue.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all">
              <Settings size={17} />
            </button>
            <div className="w-8 h-8 rounded-full bg-ink-700 flex items-center justify-center text-white text-xs font-bold ml-1">
              {user?.name?.[0] ?? 'U'}
            </div>
          </div>
        </header>

        {/* ── PAGE CONTENT ── */}
        <div className="flex-1 p-4 sm:p-6">

          {/* ══ OVERVIEW ══ */}
          {tab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-xl font-bold text-gray-800">Overview</h1>
                  <p className="text-xs text-gray-400 mt-0.5">Bienvenue, {user?.name?.split(' ')[0]} — voici votre tableau de bord</p>
                </div>
                <div className="flex items-center gap-2">
                  <select className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-600 focus:outline-none">
                    <option>Défaut</option>
                    <option>Ce mois</option>
                    <option>Ce trimestre</option>
                  </select>
                </div>
              </div>

              {/* ── STAT CARDS (style Figma) ── */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {statCards.map(({ label, value, sub, up, icon: Icon, color, bg }) => (
                  <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center`}>
                        <Icon size={17} className={color} />
                      </div>
                      <span className={`flex items-center gap-1 text-xs font-medium ${up ? 'text-emerald-500' : 'text-red-400'}`}>
                        {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {sub.split(' ')[0]}
                      </span>
                    </div>
                    <div className="font-display text-2xl font-bold text-gray-800">{value}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{label}</div>
                    <div className="text-[10px] text-gray-300 mt-1">{sub}</div>
                  </div>
                ))}
              </div>

              {/* ── AREA CHART (Total Users style) ── */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-700">Activité des emprunts</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Emprunts vs Retours — 8 derniers mois</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-ink-500" />Emprunts
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />Retours
                    </span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={areaData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="empruntsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7A4F2B" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#7A4F2B" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="retoursGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5C8261" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#5C8261" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 12 }}
                      itemStyle={{ color: '#374151' }}
                    />
                    <Area type="monotone" dataKey="emprunts" stroke="#7A4F2B" strokeWidth={2.5} fill="url(#empruntsGrad)" dot={false} activeDot={{ r: 5 }} />
                    <Area type="monotone" dataKey="retours" stroke="#5C8261" strokeWidth={2.5} fill="url(#retoursGrad)" dot={false} activeDot={{ r: 5 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* ── BAR CHART + DONUT CHART (bas, côte à côte) ── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Bar Chart - Traffic by Source style */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="mb-4">
                    <h2 className="text-sm font-semibold text-gray-700">Emprunts par genre</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Distribution par catégorie littéraire</p>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={barData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barSize={22}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis dataKey="genre" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 12 }}
                        cursor={{ fill: '#f9fafb' }}
                      />
                      <Bar dataKey="livres" radius={[6, 6, 0, 0]}>
                        {barData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={['#7A4F2B', '#5C8261', '#B8960C', '#9B6F4A', '#3E6644', '#D4AF37'][i % 6]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Donut Chart - Traffic by Location style */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="mb-4">
                    <h2 className="text-sm font-semibold text-gray-700">Statut des emprunts</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Répartition globale en pourcentage</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <ResponsiveContainer width="55%" height={180}>
                      <PieChart>
                        <Pie
                          data={donutData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {donutData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ background: '#54aed2', border: '1px solid #4ea0ca', borderRadius: 10, fontSize: 12 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-3">
                      {donutData.map(({ name, value, color }) => (
                        <div key={name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                            <span className="text-xs text-gray-500">{name}</span>
                          </div>
                          <span className="text-xs font-semibold text-gray-700">{value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── TABLEAU RÉCENT ── */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h2 className="text-sm font-semibold text-gray-700">Emprunts récents</h2>
                  <button onClick={() => setTab('historique')} className="text-xs text-ink-500 hover:text-ink-700 font-medium transition-colors">
                    Voir tout →
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Livre</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden sm:table-cell">Auteur</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Emprunté le</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Échéance</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {loans.map(l => {
                        const days = daysLeft(l.dueDate);
                        return (
                          <tr key={l.id} className="hover:bg-gray-50/70 transition-colors">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-10 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                                  <img src={l.book.cover} alt="" className="w-full h-full object-cover" />
                                </div>
                                <span className="font-medium text-gray-700 text-sm truncate max-w-[130px]">{l.book.title}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-gray-400 text-xs hidden sm:table-cell">{l.book.author}</td>
                            <td className="px-5 py-3.5 text-gray-400 text-xs hidden md:table-cell">{fmt(l.borrowedDate)}</td>
                            <td className="px-5 py-3.5">
                              <div className="text-xs text-gray-500">{fmt(l.dueDate)}</div>
                              {l.status === 'active' && (
                                <div className={`text-[10px] font-medium mt-0.5 ${days <= 3 ? 'text-red-500' : 'text-emerald-500'}`}>
                                  {days > 0 ? `J-${days}` : `J+${Math.abs(days)}`}
                                </div>
                              )}
                            </td>
                            <td className="px-5 py-3.5">
                              <span className={`px-2.5 py-1 text-[11px] font-medium rounded-full border ${statusColor[l.status]}`}>
                                {statusLabel[l.status]}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══ EMPRUNTS ACTIFS ══ */}
          {tab === 'emprunts' && (
            <div className="space-y-4 animate-fade-in">
              <h1 className="font-display text-xl font-bold text-gray-800">Emprunts actifs</h1>

              {overdue.length > 0 && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-700">{overdue.length} emprunt{overdue.length > 1 ? 's' : ''} en retard</p>
                    <p className="text-xs text-red-400 mt-0.5">Veuillez retourner ces livres dès que possible.</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...overdue, ...active].map(loan => {
                  const days = daysLeft(loan.dueDate);
                  return (
                    <div key={loan.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                      <div className="flex gap-4">
                        <div className="w-14 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                          <img src={loan.book.cover} alt={loan.book.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-gray-800 text-sm truncate">{loan.book.title}</h3>
                            <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full border flex-shrink-0 ${statusColor[loan.status]}`}>
                              {statusLabel[loan.status]}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">{loan.book.author}</p>
                          <p className="text-xs text-gray-300 mt-0.5 font-mono">{loan.book.genre}</p>
                          <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-400">Échéance : {fmt(loan.dueDate)}</span>
                              <span className={`font-semibold ${days < 0 ? 'text-red-500' : days <= 3 ? 'text-orange-500' : 'text-emerald-500'}`}>
                                {days > 0 ? `J-${days}` : `${Math.abs(days)}j retard`}
                              </span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${days < 0 ? 'bg-red-400' : days <= 3 ? 'bg-orange-400' : 'bg-emerald-400'}`}
                                style={{ width: `${Math.max(5, Math.min(100, ((21 - days) / 21) * 100))}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {[...overdue, ...active].length === 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
                  <CheckCircle size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Aucun emprunt en cours</p>
                </div>
              )}
            </div>
          )}

          {/* ══ HISTORIQUE ══ */}
          {tab === 'historique' && (
            <div className="space-y-4 animate-fade-in">
              <h1 className="font-display text-xl font-bold text-gray-800">Historique complet</h1>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Livre</th>
                        <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden sm:table-cell">Genre</th>
                        <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Emprunté</th>
                        <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Retour prévu</th>
                        <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden lg:table-cell">Retourné le</th>
                        <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {loans.map(l => (
                        <tr key={l.id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-10 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={l.book.cover} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-700 text-sm truncate max-w-[120px]">{l.book.title}</p>
                                <p className="text-xs text-gray-400">{l.book.author}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-xs text-gray-400 hidden sm:table-cell">{l.book.genre}</td>
                          <td className="px-5 py-4 text-xs text-gray-400 hidden md:table-cell">{fmt(l.borrowedDate)}</td>
                          <td className="px-5 py-4 text-xs text-gray-500">{fmt(l.dueDate)}</td>
                          <td className="px-5 py-4 text-xs text-gray-400 hidden lg:table-cell">
                            {l.returnedDate ? fmt(l.returnedDate) : '—'}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-2.5 py-1 text-[11px] font-medium rounded-full border ${statusColor[l.status]}`}>
                              {statusLabel[l.status]}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══ CATALOGUE ══ */}
          {tab === 'catalogue' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h1 className="font-display text-xl font-bold text-gray-800">Catalogue</h1>
                <span className="text-xs text-gray-400">{books.length} livres</span>
              </div>
              {borrowMsg && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium">
                  <CheckCircle size={16} className="flex-shrink-0" />
                  {borrowMsg}
                </div>
              )}
              {borrowError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">
                  <AlertTriangle size={16} className="flex-shrink-0" />
                  {borrowError}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {books.map(book => {
                  const dejaEmprunte = borrowedBookIds.has(book.id);
                  return (
                  <div key={book.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                    <div className="relative h-40 overflow-hidden bg-gray-100">
                      <img src={book.cover} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <span className={`absolute top-2.5 right-2.5 px-2 py-0.5 text-[11px] font-semibold rounded-full ${dejaEmprunte ? 'bg-ink-600 text-white' : 'bg-emerald-400 text-white'}`}>
                        {dejaEmprunte ? 'Déjà emprunté' : 'Disponible'}
                      </span>
                      <span className="absolute bottom-2.5 left-2.5 text-[10px] text-white/70 font-mono">{book.genre}</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-display font-semibold text-gray-800 text-base leading-tight">{book.title}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{book.author} · {book.year}</p>
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">{book.description}</p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <span className="text-[11px] text-gray-300 font-mono">{book.pages} pages</span>
                        {dejaEmprunte ? (
                          <span className="px-3 py-1.5 bg-gray-100 text-gray-400 text-xs font-medium rounded-lg flex items-center gap-1.5">
                            <CheckCircle size={13} /> Emprunté
                          </span>
                        ) : (
                          <button
                            onClick={() => handleEmprunter(book.id)}
                            className="px-3 py-1.5 bg-ink-700 text-white text-xs font-medium rounded-lg hover:bg-ink-800 transition-colors"
                          >
                            Emprunter
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
