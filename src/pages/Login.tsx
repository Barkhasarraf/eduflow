import { useState, FormEvent } from "react";
import { authService, isFirebaseConfigured } from "../firebaseService";
import { GraduationCap, Lock, Mail, AlertCircle, Info, Database } from "lucide-react";
import { motion } from "motion/react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await authService.signIn(email, password);
    } catch (err: any) {
      setError(err?.message || "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  // Helper helper to instantly fill mock credentials
  const fillCredentials = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword("123456"); // Seed length requirement has 6 chars
    setError("");
  };

  const isConfigured = isFirebaseConfigured();

  return (
    <div id="login-container" className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      
      {/* Decorative ambient glowing background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-blue-800/30 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Glassmorphism Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-tr from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg mb-3">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight text-center">EduFlow</h1>
          <p className="text-blue-200/70 text-sm mt-1 text-center">School Management Portal</p>
        </div>

        {/* Database Mode Chip */}
        <div className="mb-6 flex justify-center">
          {isConfigured ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-full text-xs font-mono font-medium">
              <Database className="h-3 w-3" /> Realtime Firebase Connected
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-full text-xs font-mono font-medium">
              <Info className="h-3.5 w-3.5 animate-pulse" /> Sandbox Mode (Local Preview)
            </div>
          )}
        </div>

        {error && (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-xs flex items-start gap-2"
          >
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-blue-200 text-xs uppercase font-semibold tracking-wider mb-1.5 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300/65" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter registered email"
                className="w-full bg-slate-950/40 border border-white/10 text-white placeholder-blue-300/35 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-blue-200 text-xs uppercase font-semibold tracking-wider mb-1.5 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300/65" />
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/40 border border-white/10 text-white placeholder-blue-300/35 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 active:scale-95 hover:scale-[1.02] disabled:opacity-50 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Dynamic Sandbox Multi-Role Seeding Helper Panel */}
        {!isConfigured && (
          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-blue-200/50 text-[11px] uppercase tracking-wider font-semibold mb-3 text-center">Quick Login Accounts (Sandbox)</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                id="quick-login-admin"
                onClick={() => fillCredentials("admin@eduflow.com")}
                className="py-2 px-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-blue-100 text-xs font-medium tracking-tight text-center transition-all cursor-pointer truncate"
              >
                Principal
              </button>
              <button
                id="quick-login-teacher"
                onClick={() => fillCredentials("teacher@eduflow.com")}
                className="py-2 px-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-blue-100 text-xs font-medium tracking-tight text-center transition-all cursor-pointer truncate"
              >
                Teacher (10A)
              </button>
              <button
                id="quick-login-student"
                onClick={() => fillCredentials("rohan@eduflow.com")}
                className="py-2 px-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-blue-100 text-xs font-medium tracking-tight text-center transition-all cursor-pointer truncate"
              >
                Student (10A)
              </button>
            </div>
            <p className="text-blue-300/40 text-[10px] text-center mt-3 leading-relaxed">
              * Password requirement satisfies standard length rule. Enter password "123456" for sandbox testing.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
