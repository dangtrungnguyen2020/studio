import { FieldValue } from "firebase-admin/firestore";

// Test results
export type SaveTestResultsInput = {
  userId: string;
  wpm: number;
  accuracy: number;
  errors: Record<string, number>;
  difficulty: string;
  date?: FieldValue;
};

export type TestResult = {
  id: string;
  wpm: number;
  accuracy: number;
  difficulty: string;
  timestamp: Date;
};

// Admin: Dashboard
export type AdminDashboardStats = {
  totalTests: number;
  averageWpm: number;
  averageAccuracy: number;
  testsByDate: { date: string; count: number }[];
  testsByDifficulty: { difficulty: string; count: number }[];
};

// Admin: User Management
export type UserWithAdminStatus = {
  uid: string;
  email: string | undefined;
  displayName: string | undefined;
  photoURL: string | undefined;
  isAdmin: boolean;
};
