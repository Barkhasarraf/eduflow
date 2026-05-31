import { useState, useEffect } from "react";
import { authService } from "./firebaseService";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import { GraduationCap, LogOut, User, Sparkles, Database, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Bind to auth states
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.signOut();
    } catch (err) {
      console.error("Signout error:", err);
    }
  };

  if (loading) {
    return (
      <div id="root-loading" className="min-h-screen bg-slate-900 flex flex-col justify-center items-center font-sans">
        <div className="relative flex flex-col items-center">
          <div className="bg-gradient-to-tr from-blue-500 to-indigo-600 p-4 rounded-3xl shadow-2xl mb-4 animate-pulse">
            <GraduationCap className="h-12 w-12 text-white" />
          </div>
          <div className="h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
          <h1 className="text-white text-lg font-bold tracking-wider font-mono">EduFlow Loader</h1>
          <p className="text-blue-300/40 text-xs mt-1">Configuring secure role vaults...</p>
        </div>
      </div>
    );
  }

  // Not authenticated? Show the glassmorphism login form
  if (!currentUser) {
    return <Login />;
  }

  // Render correct dashboard depending on user role
  const renderDashboard = () => {
    switch (currentUser.role) {
      case "admin":
        return <AdminDashboard />;
      case "teacher":
        return <TeacherDashboard currentUser={currentUser} />;
      case "student":
        return <StudentDashboard currentUser={currentUser} />;
      default:
        return (
          <div className="p-8 text-center max-w-md mx-auto bg-white/85 border border-red-100 rounded-2xl shadow-xl mt-12 space-y-4">
            <ShieldAlert className="h-12 w-12 text-red-500 mx-auto" />
            <h3 className="text-xl font-bold text-slate-800">Unrecognized Profile Role</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Account found with email <span className="font-semibold">{currentUser.email}</span>, but no matching role ("admin", "teacher", or "student") is assigned.
            </p>
            <button
              id="role-error-logout"
              onClick={handleLogout}
              className="px-5 py-2 bg-slate-850 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold"
            >
              Back to Login
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-705 font-sans flex flex-col antialiased">
      
      {/* Premium Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#F8FAFC]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-full opacity-[0.03] bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] bg-blue-300/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-indigo-300/10 rounded-full blur-[100px]" />
      </div>

      {/* Persistent Navigation Bar */}
      <header id="main-header" className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2.5 select-none">
            <div className="p-2 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl shadow-md text-white">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-black text-slate-850 tracking-tight">EduFlow</span>
              <span className="hidden sm:inline-block ml-2 px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                v1.2 Studio
              </span>
            </div>
          </div>

          {/* User profile actions & logout */}
          <div className="flex items-center gap-4">
            
            {/* Desktop profile chip */}
            <div className="hidden sm:flex items-center gap-3 bg-slate-50 border border-slate-100 px-4 py-1.5 rounded-full">
              <div className="h-7 w-7 rounded-full bg-blue-100 text-blue-600 font-extrabold text-xs flex items-center justify-center">
                {currentUser?.name ? currentUser.name[0].toUpperCase() : "U"}
              </div>
              <div className="text-left text-xs">
                <p className="font-bold text-slate-800 leading-none">{currentUser?.name || "User"}</p>
                <p className="text-[10px] font-semibold text-slate-400 capitalize">{currentUser?.role}</p>
              </div>
            </div>

            {/* Logout actions */}
            <button
              id="navbar-logout-btn"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-2 hover:bg-red-50 text-slate-600 hover:text-red-600 font-semibold text-xs rounded-full cursor-pointer transition border border-transparent hover:border-red-100"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentUser.role}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {renderDashboard()}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="py-6 border-t border-slate-100 font-mono text-[10px] text-slate-350 text-center select-none z-10 relative">
        <p>© 2026 EduFlow Inc. Synchronized with Firebase Realtime Gateway.</p>
      </footer>
    </div>
  );
}
