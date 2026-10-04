import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route, Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import { LogOut, Mail, Lock, Clock, RotateCcw, Play, Pause, FileText, User, Plus, FolderPlus, Layers } from 'lucide-react';
const API_URL = import.meta.env.API_URL;
const BACKEND_URL = API_URL.replace('/api', '');


export default function MainApp() {
    const [user, setUser] = useState(null); // Текущий залогиненный пользователь
    const navigate = useNavigate();
    const location = useLocation();

    // При старте проверяем, есть ли сохраненный юзер в localStorage
    useEffect(() => {
        const savedUser = localStorage.getItem('study_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('study_user', JSON.stringify(userData));
        if (userData.role === 'ADMIN') {
            navigate('/admin');
        } else {
            navigate('/tasks');
        }
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('study_user');
        navigate('/login');
    };

    // Проверка авторизации для защищенных роутов
    const RequireAuth = ({ children, adminOnly = false }) => {
        if (!user) return <Navigate to="/login" replace />;
        if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/tasks" replace />;
        return children;
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-zinc-100">
            {/* Навигация отображается только если пользователь авторизован */}
            {user && (
                <header className="border-b border-zinc-800 px-6 py-4 flex justify-between items-center bg-[#121212]/50 backdrop-blur-md sticky top-0 z-50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-900 flex items-center font-bold justify-center">S</div>
                        <span className="font-semibold tracking-wide text-lg">StudySystem</span>
                    </div>

                    <nav className="flex items-center gap-2">
                        <Link to="/tasks" className={`px-4 py-2 rounded-lg text-sm font-medium transition ${location.pathname === '/tasks' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}>Задачи</Link>
                        <Link to="/timer" className={`px-4 py-2 rounded-lg text-sm font-medium transition ${location.pathname === '/timer' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}>Таймер</Link>
                        <Link to="/profile" className={`px-4 py-2 rounded-lg text-sm font-medium transition ${location.pathname === '/profile' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}>Профиль</Link>
                        {user.role === 'ADMIN' && (
                            <Link to="/admin" className={`px-4 py-2 rounded-lg text-sm font-medium transition ${location.pathname === '/admin' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}>Админка</Link>
                        )}
                        <button onClick={handleLogout} className="ml-4 p-2 text-zinc-400 hover:text-red-400 transition" title="Выйти">
                            <LogOut size={18} />
                        </button>
                    </nav>
                </header>
            )}

            {/* Роутер страниц */}
            <main className="flex-1 max-w-5xl w-full mx-auto p-6 flex flex-col justify-center">
                <Routes>
                    <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

                    <Route path="/tasks" element={<RequireAuth><TasksPage user={user} /></RequireAuth>} />
                    <Route path="/timer" element={<RequireAuth><TimerPage user={user} /></RequireAuth>} />
                    <Route path="/profile" element={<RequireAuth><ProfilePage user={user} /></RequireAuth>} />
                    <Route path="/admin" element={<RequireAuth adminOnly={true}><AdminPage user={user} /></RequireAuth>} />

                    <Route path="*" element={<Navigate to={user ? "/tasks" : "/login"} replace />} />
                </Routes>
            </main>
        </div>
    );
}


function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // Здесь бэкенд проверяет созданный админом аккаунт
            const res = await axios.post(`${API_URL}/auth/login`, { email, password });
            onLogin(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Ошибка входа. Проверьте данные.');
        }
    };

    return (
        <div className="max-w-md w-full mx-auto space-y-6">
            <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-900 flex items-center font-bold text-xl justify-center mx-auto mb-4">S</div>
                <h1 className="text-2xl font-bold tracking-tight">Вход в систему</h1>
                <p className="text-zinc-400 text-sm">Доступ имеют только пользователи, зарегистрированные администратором.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 rounded-2xl border border-zinc-800 bg-[#141414] space-y-4 shadow-xl">
                {error && <div className="p-3 rounded-xl bg-red-950/40 border border-red-900/50 text-red-400 text-xs">{error}</div>}

                <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-zinc-500" size={16} />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600"
                            placeholder="user@example.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Пароль</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-zinc-500" size={16} />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <button type="submit" className="w-full py-3 bg-zinc-100 text-zinc-900 hover:bg-white font-medium rounded-xl transition mt-2">
                    Войти
                </button>
            </form>
        </div>
    );
}

function TasksPage() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        axios.get(`${API_URL}/tasks`).then(res => setTasks(res.data)).catch(console.error);
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Список задач</h1>
            <div className="grid gap-4">
                {tasks.length === 0 ? (
                    <p className="text-zinc-500">Задач пока нет.</p>
                ) : (
                    tasks.map((task) => (
                        <div key={task.id} className="p-5 rounded-xl border border-zinc-800 bg-[#141414] flex justify-between items-start">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h3 className="font-semibold text-lg">{task.title}</h3>
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300">+{task.points} баллов</span>
                                    {task.category && <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-950/60 text-indigo-300 border border-indigo-900/40">{task.category.name}</span>}
                                </div>
                                <p className="text-zinc-400 text-sm">{task.description}</p>
                                {task.fileUrl && task.fileUrl.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {task.fileUrl.map((url, idx) => (
                                            <a key={idx} href={url} target="_blank" rel="noreferrer" download={task.fileName[idx]} className="inline-flex items-center gap-2 text-xs text-indigo-400 bg-indigo-950/40 px-3 py-1.5 rounded-lg border border-indigo-900/50">
                                                <FileText size={14} /> {task.fileName[idx] || `Файл ${idx + 1}`}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button className="px-4 py-2 bg-zinc-100 text-zinc-900 hover:bg-white text-sm font-medium rounded-lg transition">Выполнить</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}


function TimerPage() {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => setSeconds(s => s + 1), 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    const formatTime = (sec) => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

    return (
        <div className="flex flex-col items-center justify-center py-20 space-y-8">
            <div className="flex items-center gap-2 text-zinc-400"><Clock size={20} /><span className="text-sm font-medium uppercase tracking-wider">Фокус-таймер</span></div>
            <div className="text-7xl font-mono font-bold tracking-wider text-zinc-100">{formatTime(seconds)}</div>
            <div className="flex gap-4">
                <button onClick={() => setIsActive(!isActive)} className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition ${isActive ? 'bg-amber-600 text-white' : 'bg-zinc-100 text-zinc-900'}`}>{isActive ? <Pause size={18} /> : <Play size={18} />}{isActive ? 'Пауза' : 'Старт'}</button>
                <button onClick={() => { setIsActive(false); setSeconds(0); }} className="px-4 py-3 bg-zinc-800 text-zinc-300 rounded-xl"><RotateCcw size={18} /></button>
            </div>
        </div>
    );
}

// ==================== СТРАНИЦА ПРОФИЛЯ ====================
function ProfilePage({ user }) {
    return (
        <div className="max-w-md mx-auto space-y-6 pt-6 w-full">
            <h1 className="text-2xl font-bold tracking-tight">Профиль пользователя</h1>
            <div className="p-6 rounded-2xl border border-zinc-800 bg-[#141414] space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-2xl font-bold">{user?.email[0].toUpperCase()}</div>
                    <div>
                        <h2 className="text-lg font-semibold">{user?.email}</h2>
                        <p className="text-sm text-zinc-400">Роль: <span className="text-indigo-400 font-medium">{user?.role}</span></p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800/80"><div className="text-xs text-zinc-400 mb-1">Баллы</div><div className="text-2xl font-bold">0</div></div>
                    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800/80"><div className="text-xs text-zinc-400 mb-1">Время фокуса</div><div className="text-2xl font-bold">0 мин</div></div>
                </div>
            </div>
        </div>
    );
}

// ==================== АДМИН-ПАНЕЛЬ (Создание юзеров, задач, категорий) ====================
function AdminPage() {
    // Состояния для юзеров
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPass, setNewUserPass] = useState('');

    // Состояния для категорий
    const [catName, setCatName] = useState('');

    // Состояния для задач
    const [categories, setCategories] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [newPoints, setNewPoints] = useState(10);
    const [newCategoryId, setNewCategoryId] = useState('');
    const [newFiles, setNewFiles] = useState([]);

    useEffect(() => {
        axios.get(`${API_URL}/categories`).then(res => setCategories(res.data)).catch(console.error);
    }, []);

    // 1. Создание учетной записи пользователю администратором
    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/admin/users`, { email: newUserEmail, password: newUserPass });
            setNewUserEmail('');
            setNewUserPass('');
            alert('Пользователь успешно создан и подтвержден!');
        } catch (err) {
            alert(err.response?.data?.error || 'Ошибка при создании пользователя');
        }
    };

    // 2. Создание категории
    const handleCreateCategory = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/categories`, { name: catName });
            setCatName('');
            const res = await axios.get(`${API_URL}/categories`);
            setCategories(res.data);
            alert('Категория создана!');
        } catch (err) {
            alert('Ошибка при создании категории');
        }
    };

    // 3. Создание задачи
    const handleCreateTask = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', newTitle);
        formData.append('description', newDesc);
        formData.append('points', newPoints);
        if (newCategoryId) formData.append('categoryId', newCategoryId);
        for (let i = 0; i < newFiles.length; i++) {
            formData.append('files', newFiles[i]);
        }

        try {
            await axios.post(`${API_URL}/tasks`, formData);
            setNewTitle('');
            setNewDesc('');
            setNewFiles([]);
            alert('Задача успешно создана!');
        } catch (err) {
            alert('Ошибка при создании задачи');
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-8 pb-10">
            <h1 className="text-2xl font-bold tracking-tight">Панель администратора</h1>

            {/* Блок 1: Создание пользователей */}
            <form onSubmit={handleCreateUser} className="p-6 rounded-2xl border border-zinc-800 bg-[#141414] space-y-4">
                <h3 className="font-semibold text-lg pb-2 border-b border-zinc-800 flex items-center gap-2">
                    <User size={18} /> Создать учетную запись для пользователя
                </h3>
                <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Email пользователя</label>
                    <input type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} required className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm" placeholder="student@example.com" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Пароль</label>
                    <input type="password" value={newUserPass} onChange={(e) => setNewUserPass(e.target.value)} required className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm" placeholder="Временный пароль" />
                </div>
                <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 font-medium rounded-xl transition">Создать доступ пользователю</button>
            </form>

            {/* Блок 2: Категории */}
            <form onSubmit={handleCreateCategory} className="p-6 rounded-2xl border border-zinc-800 bg-[#141414] space-y-4">
                <h3 className="font-semibold text-lg pb-2 border-b border-zinc-800 flex items-center gap-2"><FolderPlus size={18} /> Добавить категорию</h3>
                <input type="text" value={catName} onChange={(e) => setCatName(e.target.value)} required className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm" placeholder="Название категории" />
                <button type="submit" className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 font-medium rounded-xl">Создать категорию</button>
            </form>

            {/* Блок 3: Задачи */}
            <form onSubmit={handleCreateTask} className="p-6 rounded-2xl border border-zinc-800 bg-[#141414] space-y-4">
                <h3 className="font-semibold text-lg pb-2 border-b border-zinc-800 flex items-center gap-2"><Layers size={18} /> Добавить задачу</h3>
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm" placeholder="Название задачи" />
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm" placeholder="Описание" />
                <div className="grid grid-cols-2 gap-4">
                    <select value={newCategoryId} onChange={(e) => setNewCategoryId(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-300">
                        <option value="">Без категории</option>
                        {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                    </select>
                    <input type="number" value={newPoints} onChange={(e) => setNewPoints(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm" />
                </div>
                <input type="file" multiple onChange={(e) => setNewFiles(e.target.files)} className="w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700" />
                <button type="submit" className="w-full py-3 bg-zinc-100 text-zinc-900 hover:bg-white font-medium rounded-xl flex items-center justify-center gap-2">
                    <Plus size={18} /> Создать задачу
                </button>
            </form>
        </div>
    );
}