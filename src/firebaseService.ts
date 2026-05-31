import { isFirebaseConfigured, auth as firebaseAuth, db as firebaseDb } from "./firebase";
export { isFirebaseConfigured };
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut, 
  onAuthStateChanged as fbOnAuthStateChanged 
} from "firebase/auth";
import { 
  ref, 
  set, 
  onValue, 
  push, 
  get 
} from "firebase/database";

// Seed local storage with default database schemas if not present
const SEED_DATA_KEY = "eduflow_sandbox_db";

const defaultUsers = {
  "admin-uid": { uid: "admin-uid", name: "Principal Sharma", email: "admin@eduflow.com", role: "admin", class: "" },
  "teacher-uid": { uid: "teacher-uid", name: "Anjali Gupta", email: "teacher@eduflow.com", role: "teacher", class: "10A" },
  "student-1": { uid: "student-1", name: "Rohan Verma", email: "rohan@eduflow.com", role: "student", class: "10A" },
  "student-2": { uid: "student-2", name: "Sneha Rao", email: "sneha@eduflow.com", role: "student", class: "10A" },
  "student-3": { uid: "student-3", name: "Amit Patel", email: "amit@eduflow.com", role: "student", class: "10B" },
  "student-4": { uid: "student-4", name: "Priya Sharma", email: "priya@eduflow.com", role: "student", class: "10B" },
};

const defaultNotices = {
  "notice-1": { id: "notice-1", title: "Summer Camp 2026 Registration", message: "Summer camp registration is open for all classes. Please submit registration forms by next Monday.", date: "2026-05-30", by: "Principal Sharma" },
  "notice-2": { id: "notice-2", title: "Term Exam Results Published", message: "Class teachers have uploaded the marks. Students can view detailed scorecard with AI comment on their dashboard.", date: "2026-05-29", by: "Admin Office" }
};

const defaultMarks = {
  "student-1": {
    "Mathematics": { marks: 85, total: 100, aiComment: "Kaafi accha score hai! Bass calculation errors se bacho toh perfect 100 aa sakte hain." },
    "Science": { marks: 92, total: 100, aiComment: "Bahut badhiya performance! Concept clarity bohot strong hai aapki." }
  },
  "student-2": {
    "Mathematics": { marks: 78, total: 100, aiComment: "Achha prayas hai! Thoda practice double karlo, score aur improve hoga." },
    "Science": { marks: 88, total: 100, aiComment: "Good work. Formulas ko achhe se yaad rakhe toh full marks milenge." }
  },
  "student-3": {
    "Mathematics": { marks: 62, total: 100, aiComment: "Mehnat ki zaroorat hai. Kuch concepts mein confusion hai." },
    "Science": { marks: 70, total: 100, aiComment: "Satisfactory result. Agli bar aur practice ke sath push karo." }
  }
};

const defaultAttendance = {
  "2026-05-27": {
    "student-1": { status: "Present", markedBy: "teacher-uid" },
    "student-2": { status: "Present", markedBy: "teacher-uid" },
    "student-3": { status: "Absent", markedBy: "teacher-uid" }
  },
  "2026-05-28": {
    "student-1": { status: "Absent", markedBy: "teacher-uid" },
    "student-2": { status: "Present", markedBy: "teacher-uid" },
    "student-3": { status: "Present", markedBy: "teacher-uid" }
  },
  "2026-05-29": {
    "student-1": { status: "Present", markedBy: "teacher-uid" },
    "student-2": { status: "Present", markedBy: "teacher-uid" },
    "student-3": { status: "Present", markedBy: "teacher-uid" }
  },
  "2026-05-30": {
    "student-1": { status: "Present", markedBy: "teacher-uid" },
    "student-2": { status: "Present", markedBy: "teacher-uid" },
    "student-3": { status: "Present", markedBy: "teacher-uid" }
  }
};

const defaultFees = {
  "student-1": { status: "Paid", amount: 15000, date: "2026-05-15" },
  "student-2": { status: "Pending", amount: 15000, date: "" },
  "student-3": { status: "Paid", amount: 15000, date: "2026-05-12" },
  "student-4": { status: "Pending", amount: 15000, date: "" }
};

const defaultPaymentHistory = {
  "student-1": {
    "tx-1": { id: "tx-1", type: "Annual Tuition Fee", amount: 15000, date: "2026-05-15", status: "Success", method: "UPI / NetBanking" },
    "tx-2": { id: "tx-2", type: "Lab & Library Security", amount: 2500, date: "2026-04-05", status: "Success", method: "Credit Card" },
    "tx-3": { id: "tx-3", type: "Sports Tour Fee", amount: 1200, date: "2026-03-12", status: "Success", method: "Debit Card" }
  },
  "student-3": {
    "tx-4": { id: "tx-4", type: "Annual Tuition Fee", amount: 15000, date: "2026-05-12", status: "Success", method: "UPI" },
    "tx-5": { id: "tx-5", type: "Science Olympiad Quiz Fee", amount: 500, date: "2026-04-01", status: "Success", method: "NetBanking" }
  }
};

const getSandboxDB = () => {
  const data = localStorage.getItem(SEED_DATA_KEY);
  if (!data) {
    const freshDb = {
      users: defaultUsers,
      attendance: defaultAttendance,
      marks: defaultMarks,
      notices: defaultNotices,
      fees: defaultFees,
      payment_history: defaultPaymentHistory
    };
    localStorage.setItem(SEED_DATA_KEY, JSON.stringify(freshDb));
    return freshDb;
  }
  return JSON.parse(data);
};

const saveSandboxDB = (data: any) => {
  localStorage.setItem(SEED_DATA_KEY, JSON.stringify(data));
};

// Global variables for tracking current authenticated user mock state
let mockCurrentUser: any = null;
const MOCK_AUTH_KEY = "eduflow_mock_auth";

// Initial load of auth session
const savedAuth = localStorage.getItem(MOCK_AUTH_KEY);
if (savedAuth) {
  mockCurrentUser = JSON.parse(savedAuth);
}

const authListeners: Set<Function> = new Set();
const dbListeners: Set<{ path: string, callback: Function }> = new Set();

export const authService = {
  // Sign in
  async signIn(email: string, password: string): Promise<any> {
    if (isFirebaseConfigured()) {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      // Fetch user details to get role
      const dbRef = ref(firebaseDb, `users/${userCredential.user.uid}`);
      const userSnapshot = await get(dbRef);
      if (userSnapshot.exists()) {
        const roleAndInfo = userSnapshot.val();
        return {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          ...roleAndInfo
        };
      } else {
        throw new Error("User record not found in database.");
      }
    } else {
      // Sandbox implementation
      const sdb = getSandboxDB();
      const matchedUser = Object.values(sdb.users).find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (matchedUser) {
        // Simple password checking (any valid credential works, default are teacher123, student123, admin123 etc)
        const passwordMatch = password.length >= 6;
        if (passwordMatch) {
          mockCurrentUser = { ...(matchedUser as any) };
          localStorage.setItem(MOCK_AUTH_KEY, JSON.stringify(mockCurrentUser));
          // Notify listeners
          authListeners.forEach(cb => cb(mockCurrentUser));
          return mockCurrentUser;
        } else {
          throw new Error("Invalid password (must be at least 6 characters).");
        }
      } else {
        throw new Error("No user found with this email in the sandbox system.");
      }
    }
  },

  // Create User
  async createUser(userData: { name: string; email: string; role: string; class: string }, pass: string): Promise<string> {
    if (isFirebaseConfigured()) {
      // First create standard auth account
      const userCred = await createUserWithEmailAndPassword(firebaseAuth, userData.email, pass);
      const uid = userCred.user.uid;
      
      // Save details to Database
      const userRef = ref(firebaseDb, `users/${uid}`);
      await set(userRef, {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        class: userData.class,
        uid: uid
      });
      return uid;
    } else {
      // Sandbox
      const sdb = getSandboxDB();
      const emailExists = Object.values(sdb.users).some((u: any) => u.email.toLowerCase() === userData.email.toLowerCase());
      if (emailExists) {
        throw new Error("An account with this email already exists in the sandbox.");
      }
      
      const newUid = `sandbox-uid-${Date.now()}`;
      const newUser = {
        uid: newUid,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        class: userData.class
      };
      
      sdb.users[newUid] = newUser;
      
      // If role is student, initialize status in fees
      if (userData.role === "student") {
        sdb.fees[newUid] = {
          status: "Pending",
          amount: 15000,
          date: ""
        };
      }

      saveSandboxDB(sdb);
      
      // Trigger user table listeners
      triggerDbCallbacks("users");
      triggerDbCallbacks(`fees`);
      
      return newUid;
    }
  },

  // Sign out
  async signOut(): Promise<void> {
    if (isFirebaseConfigured()) {
      await fbSignOut(firebaseAuth);
    } else {
      mockCurrentUser = null;
      localStorage.removeItem(MOCK_AUTH_KEY);
      authListeners.forEach(cb => cb(null));
    }
  },

  // Observe Auth state
  onAuthStateChanged(callback: (user: any) => void): () => void {
    if (isFirebaseConfigured()) {
      return fbOnAuthStateChanged(firebaseAuth, async (user) => {
        if (user) {
          // fetch role
          const dbRef = ref(firebaseDb, `users/${user.uid}`);
          onValue(dbRef, (snap) => {
            const data = snap.val();
            callback(data ? { uid: user.uid, email: user.email, ...data } : null);
          }, () => {
            callback(null);
          });
        } else {
          callback(null);
        }
      });
    } else {
      authListeners.add(callback);
      // Immediately notify with current mock session
      callback(mockCurrentUser);
      return () => {
        authListeners.delete(callback);
      };
    }
  }
};

// Listen and trigger helpers for Realtime DB sandbox
const triggerDbCallbacks = (path: string) => {
  const sdb = getSandboxDB();
  dbListeners.forEach(listener => {
    // Check path matches (simplistic checking for onValue simulation)
    if (path.startsWith(listener.path) || listener.path.startsWith(path)) {
      const pathParts = listener.path.split("/");
      let currentVal = sdb;
      let failed = false;
      for (const part of pathParts) {
        if (part === "") continue;
        if (currentVal && currentVal[part] !== undefined) {
          currentVal = currentVal[part];
        } else {
          failed = true;
          break;
        }
      }
      listener.callback(failed ? null : currentVal);
    }
  });
};

export const dbService = {
  // Listen to nodes
  subscribe(path: string, callback: (data: any) => void): () => void {
    if (isFirebaseConfigured()) {
      const dbRef = ref(firebaseDb, path);
      return onValue(dbRef, (snap) => {
        callback(snap.val());
      });
    } else {
      const listener = { path, callback };
      dbListeners.add(listener);
      
      // Trigger initial value immediately
      const sdb = getSandboxDB();
      const pathParts = path.split("/");
      let currentVal = sdb;
      let failed = false;
      for (const part of pathParts) {
        if (part === "") continue;
        if (currentVal && currentVal[part] !== undefined) {
          currentVal = currentVal[part];
        } else {
          failed = true;
          break;
        }
      }
      callback(failed ? null : currentVal);
      
      return () => {
        dbListeners.delete(listener);
      };
    }
  },

  // Save specific node values
  async set(path: string, value: any): Promise<void> {
    if (isFirebaseConfigured()) {
      const dbRef = ref(firebaseDb, path);
      await set(dbRef, value);
    } else {
      const sdb = getSandboxDB();
      const pathParts = path.split("/");
      let currentVal = sdb;
      
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        if (part === "") continue;
        if (!currentVal[part]) {
          currentVal[part] = {};
        }
        currentVal = currentVal[part];
      }
      
      const lastPart = pathParts[pathParts.length - 1];
      currentVal[lastPart] = value;
      
      saveSandboxDB(sdb);
      triggerDbCallbacks(path);
    }
  },

  // Add item with automatically generated key (like notices)
  async push(path: string, value: any): Promise<string> {
    if (isFirebaseConfigured()) {
      const dbRef = ref(firebaseDb, path);
      const newRef = push(dbRef);
      const generatedId = newRef.key || `notice-${Date.now()}`;
      await set(newRef, { ...value, id: generatedId });
      return generatedId;
    } else {
      const sdb = getSandboxDB();
      const generatedId = `sandbox-id-${Date.now()}`;
      
      const pathParts = path.split("/");
      let currentVal = sdb;
      
      for (const part of pathParts) {
        if (part === "") continue;
        if (!currentVal[part]) {
          currentVal[part] = {};
        }
        currentVal = currentVal[part];
      }
      
      currentVal[generatedId] = { ...value, id: generatedId };
      
      saveSandboxDB(sdb);
      triggerDbCallbacks(path);
      return generatedId;
    }
  }
};
