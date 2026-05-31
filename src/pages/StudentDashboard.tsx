import { useState, useEffect } from "react";
import { dbService } from "../firebaseService";
import { 
  Award, 
  Calendar, 
  Bell, 
  CreditCard, 
  Percent, 
  ChevronRight, 
  BookOpen, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  BadgeCheck,
  User,
  ExternalLink,
  History,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface StudentDashboardProps {
  currentUser: any;
}

export default function StudentDashboard({ currentUser }: StudentDashboardProps) {
  const [attendancePercent, setAttendancePercent] = useState<number | null>(null);
  const [attendanceRatio, setAttendanceRatio] = useState({ present: 0, total: 0 });
  const [marks, setMarks] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [feesData, setFeesData] = useState<any>(null);
  const [historyList, setHistoryList] = useState<any[]>([]);

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // 1. Calculate and Subscribe to Attendance
  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsubscribe = dbService.subscribe("attendance", (allAttendance) => {
      if (allAttendance) {
        let presentCount = 0;
        let totalCount = 0;

        // Iterate through YYYY-MM-DD keys and matches
        Object.keys(allAttendance).forEach((dateKey) => {
          const dayAttendance = allAttendance[dateKey];
          if (dayAttendance && dayAttendance[currentUser.uid]) {
            totalCount++;
            if (dayAttendance[currentUser.uid].status === "Present") {
              presentCount++;
            }
          }
        });

        setAttendanceRatio({ present: presentCount, total: totalCount });
        if (totalCount > 0) {
          const pct = Math.round((presentCount / totalCount) * 100);
          setAttendancePercent(pct);
        } else {
          setAttendancePercent(null); // No logs yet
        }
      } else {
        setAttendancePercent(null);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  // 2. Subscribe to Marks node
  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsubscribe = dbService.subscribe(`marks/${currentUser.uid}`, (studentMarks) => {
      if (studentMarks) {
        const parsedMarks = Object.keys(studentMarks).map((subjKey) => ({
          subjectName: subjKey,
          ...studentMarks[subjKey]
        }));
        setMarks(parsedMarks);
      } else {
        setMarks([]);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  // 3. Subscribe to Notices (sorted by date desc)
  useEffect(() => {
    const unsubscribe = dbService.subscribe("notices", (allNotices) => {
      if (allNotices) {
        const parsedNotices = Object.keys(allNotices).map((key) => ({
          id: key,
          ...allNotices[key]
        }));
        // Sort by date desc
        parsedNotices.sort((a, b) => b.date.localeCompare(a.date));
        setNotices(parsedNotices);
      } else {
        setNotices([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // 4. Subscribe to Fees node
  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsubscribe = dbService.subscribe(`fees/${currentUser.uid}`, (fees) => {
      if (fees) {
        setFeesData(fees);
      } else {
        // Fallback default setup
        setFeesData({
          status: "Pending",
          amount: 15000,
          date: ""
        });
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  // 5. Subscribe to Payment History node
  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsubscribe = dbService.subscribe(`payment_history/${currentUser.uid}`, (history) => {
      if (history) {
        const parsedHistory = Object.keys(history).map((key) => ({
          id: key,
          ...history[key]
        }));
        // Sort by date desc (latest first)
        parsedHistory.sort((a, b) => b.date.localeCompare(a.date));
        setHistoryList(parsedHistory);
      } else {
        setHistoryList([]);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Handle Mock Fees Payment toggle & write to history logs
  const handlePayment = async () => {
    if (!currentUser?.uid) return;
    setPaymentLoading(true);
    try {
      const today = new Date();
      const localDate = today.toISOString().split("T")[0];
      
      // Update fee general status
      await dbService.set(`fees/${currentUser.uid}`, {
        status: "Paid",
        amount: 15500, // Total tuition base + activity/admission or default
        date: localDate
      });

      // Insert log into payment_history node
      await dbService.push(`payment_history/${currentUser.uid}`, {
        type: "Annual Tuition Fee",
        amount: 15000,
        date: localDate,
        status: "Success",
        method: "Mock UPI Gateway"
      });
    } catch (err) {
      console.error("Tuition payment failed:", err);
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div id="student-dashboard-container" className="space-y-8 font-sans">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Academic Dashboard</h2>
          <p className="text-slate-500 text-sm mt-0.5">Welcome, <span className="font-bold text-slate-700">{currentUser?.name || "Student"}</span>. View notices, track class attendance, scores, and manage school fees.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-4 py-1.5 rounded-full">
          <User className="h-4 w-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-700">Class {currentUser?.class || "10A"}</span>
        </div>
      </div>

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Attendance Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-slate-150/40 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Attendance Rate</p>
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-slate-850">
                {attendancePercent !== null ? `${attendancePercent}%` : "No Record"}
              </h3>
              {attendancePercent !== null && (
                <p className="text-xs text-slate-400">({attendanceRatio.present}/{attendanceRatio.total} Days)</p>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {attendancePercent !== null && attendancePercent >= 75 
                ? "Excellent! You satisfy the school's 75% visual eligibility standard."
                : attendancePercent !== null 
                ? "Warning: Attendance below 75%. Please attend regular classes routinely." 
                : "No roll calls recorded yet."}
            </p>
          </div>
        </div>

        {/* GPA / Average Grade Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-slate-150/40 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Academic Grade</p>
            <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-xl">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div>
            {marks.length > 0 ? (
              (() => {
                const totalScored = marks.reduce((sum, item) => sum + item.marks, 0);
                const totalMax = marks.reduce((sum, item) => sum + item.total, 0);
                const pct = Math.round((totalScored / totalMax) * 100);
                return (
                  <>
                    <div className="flex items-baseline gap-1">
                      <h3 className="text-3xl font-black text-slate-850">{pct}%</h3>
                      <p className="text-xs text-slate-400">Average Score</p>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      Total points: <span className="font-bold">{totalScored}/{totalMax}</span> marks across {marks.length} subjects.
                    </p>
                  </>
                );
              })()
            ) : (
              <>
                <h3 className="text-3xl font-black text-slate-350">N/A</h3>
                <p className="text-xs text-slate-400 mt-2">No graded marks found in database roster yet.</p>
              </>
            )}
          </div>
        </div>

        {/* Fees Status Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-slate-150/40 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Tuition Fees</p>
              <div className={`p-2 rounded-xl text-xs font-bold uppercase tracking-wider ${
                feesData?.status === "Paid" 
                ? "bg-emerald-100 text-emerald-700" 
                : "bg-amber-100 text-amber-700"
              }`}>
                {feesData?.status || "Pending"}
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400">Total school annual fee: <span className="font-semibold text-slate-700">₹{feesData?.amount || 15000}</span></p>
              {feesData?.status === "Paid" ? (
                <p className="text-xs text-emerald-700 mt-2 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 shrink-0" /> Paid on {feesData.date}
                </p>
              ) : (
                <div className="flex items-center gap-2 mt-2">
                  <button
                    id="fees-pay-btn"
                    onClick={handlePayment}
                    disabled={paymentLoading}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-bold rounded-xl active:scale-95 disabled:opacity-50 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    {paymentLoading ? (
                      <span className="h-3.5 w-3.5 border-2 border-white/50 border-t-white rounded-full animate-spin shrink-0" />
                    ) : (
                      <CreditCard className="h-3.5 w-3.5" />
                    )}
                    Pay Tuition Fees
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Collapsible Payment History Section */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              id="payment-history-toggle-btn"
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer select-none"
            >
              <span className="flex items-center gap-1.5 uppercase tracking-wider">
                <History className="h-3.5 w-3.5 text-indigo-500" />
                Payment History ({historyList.length})
              </span>
              {isHistoryOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            
            <AnimatePresence initial={false}>
              {isHistoryOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden mt-3 space-y-2 max-h-[170px] overflow-y-auto pr-1"
                >
                  {historyList.length > 0 ? (
                    historyList.map((tx) => (
                      <div
                        key={tx.id}
                        className="bg-slate-50 border border-slate-150/45 rounded-xl p-2.5 flex items-center justify-between text-[11px] transition hover:bg-slate-100/50"
                      >
                        <div className="space-y-0.5" id={`tx-history-item-${tx.id}`}>
                          <p className="font-extrabold text-slate-700 leading-none">{tx.type}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{tx.date} • {tx.method || "Digital Payment"}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-slate-800">₹{tx.amount}</p>
                          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full inline-block mt-0.5 uppercase tracking-wider">
                            {tx.status || "Success"}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-[11px] text-slate-400 py-4 font-mono">
                      No previous transactions found.
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Marks & Grading List */}
        <div className="lg:col-span-12 xl:col-span-7 bg-white/80 backdrop-blur-lg border border-slate-100 rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-50">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">My Subject Marks</h3>
              <p className="text-xs text-slate-400">Review teacher evaluations and AI report recommendations</p>
            </div>
          </div>

          <div className="space-y-6">
            {marks.length > 0 ? (
              marks.map((item) => (
                <div key={item.subjectName} className="border border-slate-100 rounded-xl p-4 bg-white hover:shadow-md transition">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <span className="font-extrabold text-slate-800 text-md tracking-tight">{item.subjectName}</span>
                    <span className="text-sm font-black font-mono text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                      Score: {item.marks} / {item.total}
                    </span>
                  </div>

                  {/* Render the AI Comment highlighted inside the requested yellow box */}
                  <div className="bg-amber-500/10 border border-amber-500/20 text-amber-900 rounded-xl p-3 mt-3 flex gap-2">
                    <BadgeCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800 mb-0.5">Faculty AI Mentor Feedback</p>
                      <p className="text-xs font-semibold leading-relaxed leading-medium">{item.aiComment}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-slate-50/50 border border-slate-100 rounded-xl text-slate-400 font-mono text-sm">
                No marks uploaded for you in the system roster yet.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Notices Lists */}
        <div className="lg:col-span-12 xl:col-span-5 bg-white/80 backdrop-blur-lg border border-slate-100 rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-50">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <Bell className="h-5 w-5 animate-swing" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Notice Board</h3>
              <p className="text-xs text-slate-400">Official institution updates and announcements</p>
            </div>
          </div>

          <div className="space-y-4">
            {notices.length > 0 ? (
              notices.map((notice) => (
                <div key={notice.id} className="p-4 border-l-4 border-indigo-500 bg-indigo-50/20 rounded-r-xl space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-800">{notice.title}</h4>
                    <span className="text-[10px] font-mono text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded-full">{notice.date}</span>
                  </div>
                  <p className="text-xs text-slate-650 leading-relaxed leading-medium">{notice.message}</p>
                  <p className="text-[10px] text-indigo-600/70 font-semibold pt-1">By: {notice.by}</p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-slate-50/50 border border-slate-100 rounded-xl text-slate-400 font-mono text-xs">
                Notice Board is empty. No announcements posted.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
