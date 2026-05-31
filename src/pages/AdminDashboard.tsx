import { useState, useEffect, FormEvent } from "react";
import { authService, dbService } from "../firebaseService";
import { 
  Users, 
  GraduationCap, 
  UserSquare, 
  Plus, 
  Eye, 
  EyeOff, 
  Info,
  Calendar,
  Award,
  BookOpen,
  Mail,
  UserPlus,
  BookMarked
} from "lucide-react";
import { motion } from "motion/react";

export default function AdminDashboard() {
  const [usersList, setUsersList] = useState<any[]>([]);
  
  // Add User Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // Default dropdown role
  const [className, setClassName] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Realtime search text
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Notice Board Form State
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");
  const [noticeSuccess, setNoticeSuccess] = useState("");
  const [noticeError, setNoticeError] = useState("");
  const [noticeLoading, setNoticeLoading] = useState(false);

  const handlePublishNotice = async (e: FormEvent) => {
    e.preventDefault();
    setNoticeError("");
    setNoticeSuccess("");

    if (!noticeTitle || !noticeMessage) {
      setNoticeError("Please fill in notice Title and Message.");
      return;
    }

    setNoticeLoading(true);
    try {
      const today = new Date();
      const localDate = today.toISOString().split("T")[0];
      await dbService.push("notices", {
        title: noticeTitle,
        message: noticeMessage,
        date: localDate,
        by: "Principal Sharma"
      });

      setNoticeSuccess("Announcement published successfully on the Student Notice Board!");
      setNoticeTitle("");
      setNoticeMessage("");
    } catch (err: any) {
      setNoticeError(err?.message || "Failed to publish notice.");
    } finally {
      setNoticeLoading(false);
    }
  };

  // Subscribe to Users node in Realtime DB
  useEffect(() => {
    const unsubscribe = dbService.subscribe("users", (usersVal) => {
      if (usersVal) {
        const parsedUsers = Object.keys(usersVal).map((key) => ({
          uid: key,
          ...usersVal[key],
        }));
        setUsersList(parsedUsers);
      } else {
        setUsersList([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAddUser = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!name || !email || !password) {
      setError("Please fill in Name, Email, and Password.");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (role !== "admin" && !className) {
      setError("Please specify a Class (e.g., 10A, 10B) for Teachers and Students.");
      return;
    }

    setLoading(true);
    try {
      await authService.createUser({
        name,
        email,
        role,
        class: role === "admin" ? "" : className.toUpperCase().trim()
      }, password);

      setSuccess(`Account for ${name} (${role}) created successfully!`);
      // Reset form fields
      setName("");
      setEmail("");
      setPassword("");
      setClassName("");
    } catch (err: any) {
      setError(err?.message || "Failed to create user account.");
    } finally {
      setLoading(false);
    }
  };

  // Stat computations derived from the users list
  const totalUsers = usersList.length;
  const totalTeachers = usersList.filter(u => u.role === "teacher").length;
  const totalStudents = usersList.filter(u => u.role === "student").length;

  const filteredUsers = usersList.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.class?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div id="admin-dashboard-container" className="space-y-8">
      
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Administration</h2>
          <p className="text-slate-500 text-sm mt-0.5">Control roles, provision security profiles, and view global institution metrics in realtime.</p>
        </div>
      </div>

      {/* Primary Stat Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Users Stat Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-slate-100 p-6 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Total Accounts</p>
            <h3 className="text-3xl font-black text-slate-800">{totalUsers}</h3>
            <p className="text-[11px] text-slate-400">Synced in database</p>
          </div>
          <div className="h-12 w-12 bg-blue-100/70 text-blue-600 rounded-xl flex items-center justify-center shadow-inner">
            <Users className="h-6 w-6" />
          </div>
        </motion.div>

        {/* Total Teachers Stat Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-slate-100 p-6 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Total Faculty</p>
            <h3 className="text-3xl font-black text-slate-800">{totalTeachers}</h3>
            <p className="text-[11px] text-slate-400">Associated assigned classes</p>
          </div>
          <div className="h-12 w-12 bg-indigo-100/70 text-indigo-600 rounded-xl flex items-center justify-center shadow-inner">
            <BookOpen className="h-6 w-6" />
          </div>
        </motion.div>

        {/* Total Students Stat Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-slate-100 p-6 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Enrolled Scholars</p>
            <h3 className="text-3xl font-black text-slate-800">{totalStudents}</h3>
            <p className="text-[11px] text-slate-400">Tracked dashboard members</p>
          </div>
          <div className="h-12 w-12 bg-emerald-100/70 text-emerald-600 rounded-xl flex items-center justify-center shadow-inner">
            <GraduationCap className="h-6 w-6" />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Forms */}
        <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-8">
          
          {/* Provision Form Card */}
          <div className="bg-white/80 backdrop-blur-lg border border-slate-100 rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Add New User</h3>
                <p className="text-xs text-slate-400">Instantly provision authenticated credentials</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50/70 border border-red-100 text-red-700 text-xs flex items-start gap-2">
                <Info className="h-4 w-4 shrink-0 mt-0.5 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs flex items-start gap-2 animate-bounce">
                <Info className="h-4 w-4 shrink-0 mt-0.5 text-emerald-500" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-slate-600 font-semibold text-xs mb-1">Full Name</label>
                <input
                  id="admin-new-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Harish Kumar"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 placeholder-slate-400 px-3.5 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold text-xs mb-1">Email Address</label>
                <input
                  id="admin-new-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., harish@school.com"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 placeholder-slate-400 px-3.5 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold text-xs mb-1">Security Password</label>
                <div className="relative">
                  <input
                    id="admin-new-pw"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 placeholder-slate-400 px-3.5 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pr-10"
                  />
                  <button
                    id="admin-toggle-pwd"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-600 text-xs cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-semibold text-xs mb-1">System Role</label>
                  <select
                    id="admin-new-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold text-[11px] mb-1">
                    Class Room {role === "admin" && <span className="text-slate-350 italic">(N/A)</span>}
                  </label>
                  <input
                    id="admin-new-class"
                    type="text"
                    disabled={role === "admin"}
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="e.g., 10A, 11B"
                    className="w-full bg-slate-50 disabled:bg-slate-100 disabled:text-slate-450 border border-slate-200 text-slate-700 placeholder-slate-400 px-3.5 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm uppercase"
                  />
                </div>
              </div>

              <button
                id="admin-submit-user-btn"
                type="submit"
                disabled={loading}
                className="w-full py-2.5 mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Plus className="h-4 w-4" /> Add User Account
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Broadcaster Announcement Card */}
          <div className="bg-white/80 backdrop-blur-lg border border-slate-100 rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Notice Broadcaster</h3>
                <p className="text-xs text-slate-400">Broadcast official institution statements</p>
              </div>
            </div>

            {noticeError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-start gap-2">
                <Info className="h-4 w-4 shrink-0 mt-0.5 text-red-500" />
                <span>{noticeError}</span>
              </div>
            )}

            {noticeSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs flex items-start gap-2 animate-bounce">
                <Info className="h-4 w-4 shrink-0 mt-0.5 text-emerald-500" />
                <span>{noticeSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePublishNotice} className="space-y-4">
              <div>
                <label className="block text-slate-600 font-semibold text-xs mb-1">Announcement Title</label>
                <input
                  id="admin-notice-title"
                  type="text"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="e.g., Summer Camp Registrations"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 placeholder-slate-400 px-3.5 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold text-xs mb-1">Detailed Message</label>
                <textarea
                  id="admin-notice-msg"
                  rows={4}
                  value={noticeMessage}
                  onChange={(e) => setNoticeMessage(e.target.value)}
                  placeholder="Type official announcement contents..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 placeholder-slate-400 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                />
              </div>

              <button
                id="admin-notice-submit"
                type="submit"
                disabled={noticeLoading}
                className="w-full py-2.5 mt-4 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer border border-transparent shadow-md"
              >
                {noticeLoading ? (
                  <span className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                ) : (
                  "Broadcast Announcement"
                )}
              </button>
            </form>
          </div>

        </div>

        {/* User Directory Table Card */}
        <div className="lg:col-span-12 xl:col-span-7 bg-white/80 backdrop-blur-lg border border-slate-100 rounded-2xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <UserSquare className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">User accounts Directory</h3>
                <p className="text-xs text-slate-400">Interactive roster synchronization</p>
              </div>
            </div>
          </div>

          {/* Quick Search & filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <input
              id="admin-search-users"
              type="text"
              placeholder="Search Name, Email, or Class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 placeholder-slate-400 px-3.5 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
            />
            <div className="flex gap-2">
              <select
                id="admin-filter-role"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admins</option>
                <option value="teacher">Teachers</option>
                <option value="student">Students</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase font-extrabold">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Assigned Class</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-55">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.uid} className="hover:bg-indigo-50/20 text-slate-700 text-xs transition duration-150">
                      <td className="p-4 font-semibold text-slate-800">{user.name}</td>
                      <td className="p-4 text-slate-500 font-mono select-all">{user.email}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                          user.role === "admin" 
                          ? "bg-rose-50 text-rose-600 border border-rose-100" 
                          : user.role === "teacher" 
                          ? "bg-purple-100 text-purple-700" 
                          : "bg-emerald-100 text-emerald-700"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 font-extrabold text-slate-800">
                        {user.role === "admin" ? (
                          <span className="text-slate-350 font-normal italic">-</span>
                        ) : (
                          user.class || "Not Assigned"
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400 font-medium font-mono text-sm">
                      No matching registered users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
