import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserButton, useUser } from "@clerk/clerk-react";
import { Search, BookOpen, Users, Clock, DollarSign, Activity, ShieldCheck, Zap, BarChart3 } from "lucide-react"; 
import AddBook from '../components/AddBook';
import BookList from '../components/BookList';
import MyBorrowedBooks from '../components/MyBorrowedBooks';
import ManageUsers from '../components/ManageUsers';
import HistoryLog from '../components/HistoryLog';

function Dashboard() {
  const [books, setBooks] = useState([]);
  const [dbUser, setDbUser] = useState(null); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [stats, setStats] = useState({ totalBooks: 0, activeLoans: 0, totalUsers: 0, totalFines: 0 });
  const { user } = useUser();

  // 🚀 PRODUCTION URL CONFIGURATION
  // This looks at your .env file for VITE_API_URL. If not found, it uses localhost.
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const isAdmin = dbUser?.role === 'admin';
  const isLibrarian = dbUser?.role === 'librarian';
  const canManageBooks = isAdmin || isLibrarian;

  // 🔄 REFRESH DATA: Updates inventory and the 4 Analytics Cards simultaneously
  const refreshAllData = async () => {
    try {
      const [booksRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/api/books/all`),
        axios.get(`${API_URL}/api/stats`)
      ]);
      setBooks(booksRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Critical Data Sync Error", err);
    }
  };

  const fetchProfile = async () => {
    if (user) {
        const res = await axios.get(`${API_URL}/api/users/profile/${user.id}`);
        setDbUser(res.data);
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      if (user) {
        // Sync user with our MongoDB
        await axios.post(`${API_URL}/api/users/sync`, {
          clerkId: user.id, 
          email: user.primaryEmailAddress.emailAddress, 
          name: user.fullName,
        });
        await fetchProfile();
      }
    };
    initializeApp();
    refreshAllData();
  }, [user]);

  // 📧 OVERDUE NOTIFICATION ACTION
  const handleNotifyOverdue = async () => {
    try {
        const res = await axios.post(`${API_URL}/api/borrow/notify-overdue`);
        alert(`⚡ Automation Active: ${res.data.message}`);
    } catch (err) {
        alert("Failed to send overdue notifications.");
    }
  };

  // 🔍 Filter books based on search term
  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F1F5F9] pb-20 selection:bg-blue-600 selection:text-white">
      
      {/* --- PREMIUM NAVBAR --- */}
      <nav className="bg-white/70 backdrop-blur-xl border-b border-slate-200 p-4 sticky top-0 z-50 px-6 lg:px-12 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
            <div className="bg-slate-900 p-2.5 rounded-2xl text-white shadow-lg">
                <BookOpen size={22} strokeWidth={2.5}/>
            </div>
            <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic leading-none pr-3">Sura Lib</h1>
                <p className="text-[9px] font-bold text-blue-600 uppercase tracking-[0.2em] mt-1">Advanced Management</p>
            </div>
        </div>
        
        <div className="flex items-center gap-5">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-800 leading-none mb-1">{user?.fullName}</p>
            <div className="flex items-center justify-end gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isAdmin ? 'bg-rose-500' : isLibrarian ? 'bg-purple-500' : 'bg-emerald-500'}`}></div>
                <span className={`text-[9px] font-black uppercase tracking-widest ${isAdmin ? 'text-rose-600' : isLibrarian ? 'text-purple-600' : 'text-emerald-600'}`}>
                    {dbUser?.role || 'authorized user'}
                </span>
            </div>
          </div>
          <div className="border-l border-slate-200 pl-5">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      <div className="p-6 lg:p-12 max-w-[1600px] mx-auto">
        
        {/* --- DYNAMIC ANALYTICS GRID (Visible to Staff) --- */}
        {canManageBooks && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-white p-6 rounded-[2.5rem] border border-white shadow-xl flex items-center justify-between group hover:-translate-y-1 transition-all duration-300">
                    <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Books</p><p className="text-3xl font-black text-slate-900">{stats.totalBooks}</p></div>
                    <div className="bg-blue-500 p-4 rounded-[1.5rem] text-white shadow-lg group-hover:rotate-12 transition-transform"><BookOpen /></div>
                </div>

                <div className="bg-white p-6 rounded-[2.5rem] border border-white shadow-xl flex items-center justify-between group hover:-translate-y-1 transition-all duration-300">
                    <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Loans</p><p className="text-3xl font-black text-slate-900">{stats.activeLoans}</p></div>
                    <div className="bg-orange-500 p-4 rounded-[1.5rem] text-white shadow-lg group-hover:rotate-12 transition-transform"><Clock /></div>
                </div>

                <div className="bg-white p-6 rounded-[2.5rem] border border-white shadow-xl flex items-center justify-between group hover:-translate-y-1 transition-all duration-300">
                    <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Members</p><p className="text-3xl font-black text-slate-900">{stats.totalUsers}</p></div>
                    <div className="bg-purple-500 p-4 rounded-[1.5rem] text-white shadow-lg group-hover:rotate-12 transition-transform"><Users /></div>
                </div>

                <div className="bg-rose-600 p-6 rounded-[2.5rem] border border-rose-500 shadow-xl flex items-center justify-between relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                    <div className="relative z-10 text-white">
                        <p className="text-[10px] font-black text-rose-200 uppercase tracking-widest mb-1">Pending Fines</p>
                        <p className="text-3xl font-black leading-none">${stats.totalFines}</p>
                    </div>
                    {isAdmin && (
                        <button onClick={handleNotifyOverdue} className="relative z-10 bg-white text-rose-600 p-4 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all group/btn" title="Send Overdue Emails Now">
                            <Zap size={24} fill="currentColor" className="group-hover/btn:animate-bounce" />
                        </button>
                    )}
                    <DollarSign className="absolute -right-4 -bottom-4 text-white/10" size={120} />
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-4 space-y-10">
            {/* --- MANAGEMENT & CONTROL --- */}
            <section>
                {canManageBooks ? (
                    <div className="bg-white border border-slate-200 p-8 rounded-[3rem] shadow-sm">
                        <div className="flex items-center gap-3 mb-8 text-blue-600">
                            <Zap size={20} fill="currentColor"/>
                            <h3 className="text-xl font-black text-slate-800 italic uppercase tracking-tighter">Add New Item</h3>
                        </div>
                        <AddBook onBookAdded={refreshAllData} />
                    </div>
                ) : (
                    <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
                        <ShieldCheck className="absolute -right-4 -bottom-4 opacity-10" size={180} />
                        <h3 className="text-3xl font-black tracking-tighter italic uppercase mb-2 pr-2">Student <span className="text-blue-400">Mode</span></h3>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[200px]">Secure library access. Enjoy your digital and physical collection!</p>
                    </div>
                )}
            </section>
            
            {/* User's Borrowed Items */}
            <MyBorrowedBooks refresh={books} onReturn={refreshAllData} />

            {/* User Management (Admin Only) */}
            {isAdmin && <ManageUsers onUserUpdate={fetchProfile} />}
          </div>

          <div className="lg:col-span-8">
            {/* --- CATALOG VIEW --- */}
            <div className="bg-white p-8 lg:p-12 rounded-[4rem] shadow-sm border border-slate-100 min-h-[800px]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Catalog Explorer</h3>
                  
                  {/* Search Engine */}
                  <div className="relative w-full md:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" placeholder="Search title or author..." 
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-inner"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* 🚀 CRITICAL: Passing userRole to enable Delete and PDF links */}
                <BookList 
                  books={filteredBooks} 
                  onAction={refreshAllData} 
                  userRole={dbUser?.role} 
                />
            </div>
          </div>

          {/* --- TRANSACTION HISTORY (Staff Only) --- */}
          {canManageBooks && (
            <div className="lg:col-span-12 mt-6">
               <HistoryLog 
                  refresh={books} 
                  userRole={dbUser?.role} 
                />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;