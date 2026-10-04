import { BrowserRouter } from 'react-router-dom'
import './App.css'

import MainApp from './pages/MainApp';

export default function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}

// function MainApp() {

//   const [user, setUser] = useState(null); 
//   const [tasks, setTasks] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [activeTab, setActiveTab] = useState('tasks');


//   const [profile, setProfile] = useState({ username: 'Студент', points: 150, totalTime: 0 });
//   const [seconds, setSeconds] = useState(0);
//   const [isActive, setIsActive] = useState(false);

//   const [newTitle, setNewTitle] = useState('');
//   const [newDesc, setNewDesc] = useState('');
//   const [newPoints, setNewPoints] = useState(10);
//   const [newCategoryId, setNewCategoryId] = useState('');
//   const [newFile, setNewFile] = useState([]);

//   // Форма создания категории
//   const [catName, setCatName] = useState('');
//   const [catDesc, setCatDesc] = useState('');

//   useEffect(() => {
//     fetchTasks();
//     fetchCategories();
//   }, []);

//   const fetchTasks = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/tasks`);
//       setTasks(res.data);
//     }
//     catch (err) {
//       console.error('Ошибка при получении задач:', err);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/categories`);
//       setCategories(res.data);
//     } catch (err) {
//       console.error('Ошибка загрузки категорий:', err);
//     }
//   }


//   useEffect(() => {
//     let interval = null;
//     if (isActive) {
//       interval = setInterval(() => {
//         setSeconds((sec) => sec + 1);
//       }, 1000);
//     } else {
//       clearInterval(interval);
//     }
//     return () => clearInterval(interval);
//   }, [isActive]);

//   const formatTime = (totalSec) => {
//     const mins = Math.floor(totalSec / 60);
//     const secs = totalSec % 60;
//     return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
//   };

//   const handleCreateTask = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append('title', newTitle);
//     formData.append('description', newDesc);
//     formData.append('points', newPoints);
//     if (newCategoryId) formData.append('categoryId', newCategoryId);
//     for (let i = 0; i < newFile.length; i++) {
//       formData.append('files', newFile[i]);
//     }

//     try {
//       await axios.post(`${API_URL}/tasks`, formData);
//       setNewTitle('');
//       setNewDesc('');
//       setNewPoints(10);
//       setNewCategoryId('');
//       setNewFile([]);
//       fetchTasks();
//       alert('Задача успешно создана!');
//     }
//     catch (err) {
//       console.error('Ошибка создания задачи:', err);
//       alert('Ошибка при создании задачи');
//     }
//   };

//   // Создание категории
//   const handleCreateCategory = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${API_URL}/categories`, { name: catName, description: catDesc });
//       setCatName('');
//       setCatDesc('');
//       fetchCategories();
//       alert('Категория успешно создана!');
//     } catch (err) {
//       alert('Ошибка при создании категории (возможно, она уже существует)');
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-zinc-100">
//       <header className="border-b border-zinc-800 px-6 py-4 flex justify-between items-center bg-[#121212]/50 backdrop-blur-md sticky top-0 z-50">
//         <div className="flex items-center gap-3">
//           <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-900 flex items-center font-bold justify-center">S</div>
//           <span className="font-semibold tracking-wide text-lg">StudySystem</span>
//         </div>
//         <nav className="flex gap-2">
//           <button
//             onClick={() => setActiveTab('tasks')}
//             className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'tasks' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
//           >
//             Задачи
//           </button>
//           <button
//             onClick={() => setActiveTab('timer')}
//             className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'timer' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
//           >
//             Таймер
//           </button>
//           <button
//             onClick={() => setActiveTab('profile')}
//             className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'profile' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
//           >
//             Профиль
//           </button>
//           <button
//             onClick={() => setActiveTab('admin')}
//             className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'admin' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
//           >
//             Админка
//           </button>
//         </nav>
//       </header>
//       <main className="flex-1 max-w-5xl w-full mx-auto p-6">

//         {/* ВКЛАДКА: ЗАДАЧИ */}
//         {activeTab === 'tasks' && (
//           <div className="space-y-6">
//             <h1 className="text-2xl font-bold tracking-tight">Список задач</h1>
//             <div className="grid gap-4">
//               {tasks.length === 0 ? (
//                 <p className="text-zinc-500">Задач пока нет. Создайте их через вкладку «Админка».</p>
//               ) : (
//                 tasks.map((task) => (
//                   <div key={task.id} className="p-5 rounded-xl border border-zinc-800 bg-[#141414] flex justify-between items-start">
//                     <div className="space-y-2">
//                       <div className="flex items-center gap-3">
//                         <h3 className="font-semibold text-lg">{task.title}</h3>
//                         <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300">
//                           +{task.points} баллов
//                         </span>
//                         {task.category && (
//                           <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-950/60 text-indigo-300 border border-indigo-900/40">
//                             {task.category.name}
//                           </span>
//                         )}
//                       </div>
//                       <p className="text-zinc-400 text-sm">{task.description}</p>

//                       {/* Ссылка на прикрепленный файл (pptx, docx, xlsx, md и т.д.) */}
//                       {task.fileUrl && task.fileUrl.length > 0 && (
//                         <div className="flex flex-wrap gap-2 pt-1">
//                           {task.fileUrl.map((url, index) => (
//                             <a
//                               key={index}
//                               href={`http://localhost:5000${url}`}
//                               target="_blank"
//                               rel="noreferrer"
//                               className="inline-flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-950/40 px-3 py-1.5 rounded-lg border border-indigo-900/50">
//                               <FileText size={14} /> {task.fileName[index] || `Файл ${index + 1}`}
//                             </a>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                     <button className="px-4 py-2 bg-zinc-100 text-zinc-900 hover:bg-white text-sm font-medium rounded-lg transition">
//                       Выполнить
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         )}

//         {/* ВКЛАДКА: ТАЙМЕР */}
//         {activeTab === 'timer' && (
//           <div className="flex flex-col items-center justify-center py-20 space-y-8">
//             <div className="flex items-center gap-2 text-zinc-400">
//               <Clock size={20} />
//               <span className="text-sm font-medium uppercase tracking-wider">Фокус-таймер</span>
//             </div>

//             <div className="text-7xl font-mono font-bold tracking-wider text-zinc-100">
//               {formatTime(seconds)}
//             </div>

//             <div className="flex gap-4">
//               <button
//                 onClick={() => setIsActive(!isActive)}
//                 className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition ${isActive ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-zinc-100 text-zinc-900 hover:bg-white'}`}>
//                 {isActive ? <Pause size={18} /> : <Play size={18} />}
//                 {isActive ? 'Пауза' : 'Старт'}
//               </button>
//               <button
//                 onClick={() => { setIsActive(false); setSeconds(0); }}
//                 className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition">
//                 <RotateCcw size={18} />
//               </button>
//             </div>
//           </div>
//         )}

//         {/* ВКЛАДКА: ПРОФИЛЬ */}
//         {activeTab === 'profile' && (
//           <div className="max-w-md mx-auto space-y-6 pt-6">
//             <h1 className="text-2xl font-bold tracking-tight">Профиль пользователя</h1>
//             <div className="p-6 rounded-2xl border border-zinc-800 bg-[#141414] space-y-6">
//               <div className="flex items-center gap-4">
//                 <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-2xl font-bold">
//                   {profile.username[0]}
//                 </div>
//                 <div>
//                   <h2 className="text-lg font-semibold">{profile.username}</h2>
//                   <p className="text-sm text-zinc-400">Студент • Роль: USER</p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4 pt-2">
//                 <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800/80">
//                   <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
//                     <Trophy size={14} /> Баллы
//                   </div>
//                   <div className="text-2xl font-bold">{profile.points}</div>
//                 </div>
//                 <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800/80">
//                   <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
//                     <Clock size={14} /> Время фокуса
//                   </div>
//                   <div className="text-2xl font-bold">{Math.floor(profile.totalTime / 60)} мин</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ВКЛАДКА: АДМИНКА (Создание задач и файлов) */}
//         {activeTab === 'admin' && (
//           <div className="max-w-xl mx-auto space-y-6">
//             <h1 className="text-2xl font-bold tracking-tight">Панель администратора</h1>
//             {/* 1. Форма создания категории */}
//             <form onSubmit={handleCreateCategory} className="p-6 rounded-2xl border border-zinc-800 bg-[#141414] space-y-4">
//               <h3 className="font-semibold text-lg pb-2 border-b border-zinc-800 flex items-center gap-2">
//                 <FolderPlus size={18} /> Добавить новую категорию
//               </h3>

//               <div>
//                 <label className="block text-xs font-medium text-zinc-400 mb-1">Название категории</label>
//                 <input
//                   type="text"
//                   value={catName}
//                   onChange={(e) => setCatName(e.target.value)}
//                   required
//                   className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600"
//                   placeholder="Например: Frontend, Математика, Алгоритмы"
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-medium text-zinc-400 mb-1">Описание (необязательно)</label>
//                 <input
//                   type="text"
//                   value={catDesc}
//                   onChange={(e) => setCatDesc(e.target.value)}
//                   className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600"
//                   placeholder="Краткое описание..."
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-medium rounded-xl transition flex items-center justify-center gap-2">
//                 <Plus size={18} /> Создать категорию
//               </button>
//             </form>
//             <form onSubmit={handleCreateTask} className="p-6 rounded-2xl border border-zinc-800 bg-[#141414] space-y-4">
//               <h3 className="font-semibold text-lg pb-2 border-b border-zinc-800">Добавить новую задачу</h3>

//               <div>
//                 <label className="block text-xs font-medium text-zinc-400 mb-1">Название задачи</label>
//                 <input
//                   type="text"
//                   value={newTitle}
//                   onChange={(e) => setNewTitle(e.target.value)}
//                   required
//                   className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600"
//                   placeholder="Например: Изучить основы TypeScript"
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-medium text-zinc-400 mb-1">Описание</label>
//                 <textarea
//                   value={newDesc}
//                   onChange={(e) => setNewDesc(e.target.value)}
//                   className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600"
//                   placeholder="Детали задачи..."
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-xs font-medium text-zinc-400 mb-1">Категория</label>
//                   <select
//                     value={newCategoryId}
//                     onChange={(e) => setNewCategoryId(e.target.value)}
//                     className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600 text-zinc-300">
//                     <option value="">Без категории</option>
//                     {categories.map((cat) => (
//                       <option key={cat.id} value={cat.id}>{cat.name}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-zinc-400 mb-1">Баллы</label>
//                   <input
//                     type="number"
//                     value={newPoints}
//                     onChange={(e) => setNewPoints(e.target.value)}
//                     className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-zinc-400 mb-1">Прикрепить файл (pptx, docx, xlsx, md...)</label>
//                   <input
//                     type="file"
//                     multiple
//                     onChange={(e) => setNewFile(e.target.files)}
//                     className="w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700"
//                   />
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 className="w-full py-3 bg-zinc-100 text-zinc-900 hover:bg-white font-medium rounded-xl transition flex items-center justify-center gap-2 mt-4">
//                 <Plus size={18} /> Создать задачу
//               </button>
//             </form>
//           </div>
//         )}

//       </main>
//     </div>
//   );
// }


