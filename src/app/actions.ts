
"use server";

import { generatePersonalizedExercises } from "@/ai/flows/personalized-typing-exercises";
import type { PersonalizedExercisesInput, PersonalizedExercisesOutput } from "@/ai/flows/personalized-typing-exercises";
import { db, storage } from "@/lib/firebase-admin";
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, doc, getDoc, updateDoc, getCountFromServer, setDoc, deleteField, arrayUnion, arrayRemove } from "firebase/firestore";
import { getStorage as getAdminStorage } from 'firebase-admin/storage';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { randomUUID } from "crypto";

async function getAdminUids(): Promise<string[]> {
    const adminDoc = await doc(db, 'app-settings', 'admins').get();
    if (adminDoc.exists) {
        return adminDoc.data()?.uids || [];
    }
    return [];
}

async function verifyAdmin(userId: string): Promise<boolean> {
    const adminUids = await getAdminUids();
    return adminUids.includes(userId);
}

export async function getAIPoweredExercises(
  input: PersonalizedExercisesInput
): Promise<PersonalizedExercisesOutput> {
  try {
    const output = await generatePersonalizedExercises(input);
    return output;
  } catch (error) {
    console.error("Error generating personalized exercises:", error);
    throw new Error("Failed to generate AI exercises. Please try again later.");
  }
}

type SaveTestResultsInput = {
  userId: string;
  wpm: number;
  accuracy: number;
  errors: Record<string, number>;
  difficulty: string;
};

export async function saveTestResults(input: SaveTestResultsInput) {
  if (!input.userId) {
    // This action should only be called for logged-in users, 
    // but as a safeguard, we won't throw an error to the client.
    console.log("Attempted to save results without a user ID.");
    return;
  }
  try {
    const docRef = await addDoc(collection(db, "typing-sessions"), {
      ...input,
      timestamp: serverTimestamp(),
    });
    console.log("Test results saved with ID: ", docRef.id);
  } catch (error) {
    console.error("Error saving test results to Firestore:", error);
    // We don't want to throw an error to the user if this fails,
    // as it's not critical to their experience, but we should log it.
  }
}

export type TestResult = {
    id: string;
    wpm: number;
    accuracy: number;
    difficulty: string;
    timestamp: Date;
};

export async function getTestResults(userId: string): Promise<TestResult[]> {
    if (!userId) {
        return [];
    }

    try {
        const q = query(
            collection(db, "typing-sessions"), 
            where("userId", "==", userId),
            orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        const results: TestResult[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            results.push({
                id: doc.id,
                wpm: data.wpm,
                accuracy: data.accuracy,
                difficulty: data.difficulty,
                timestamp: data.timestamp.toDate(),
            });
        });
        return results;
    } catch (error) {
        console.error("Error fetching test results:", error);
        return [];
    }
}

export async function uploadImage(formData: FormData): Promise<string> {
  const file = formData.get('image') as File;
  if (!file) {
    throw new Error('No image provided');
  }

  // Use the regular client-side SDK storage reference for upload
  // This requires proper Storage rules to be set up.
  // For simplicity in this context, we assume public write access or authenticated user access.
  const clientStorage = getAdminStorage().bucket();
  const storageRef = ref(getStorage(app), `articles/${randomUUID()}-${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
}

export type Article = {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  authorId: string;
  authorName: string;
  authorPhotoURL: string;
  createdAt: Date;
  language: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
};

export async function createArticle(data: Omit<Article, 'id' | 'createdAt' | 'status' | 'rejectionReason'>) {
  try {
    const docRef = await addDoc(collection(db, "articles"), {
      ...data,
      createdAt: serverTimestamp(),
      status: 'pending',
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating article:", error);
    throw new Error("Failed to create article.");
  }
}

export async function getArticles(): Promise<Article[]> {
  try {
    const q = query(
        collection(db, "articles"), 
        where("status", "==", "approved"),
        orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const articles: Article[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      articles.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
      } as Article);
    });
    return articles;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}


export async function getArticle(id: string): Promise<Article | null> {
  try {
    const docRef = doc(db, "articles", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt.toDate(),
      } as Article;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

export async function getUserArticles(userId: string): Promise<Article[]> {
  if (!userId) return [];
  try {
    const q = query(
      collection(db, 'articles'),
      where('authorId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const articles: Article[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      articles.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
      } as Article);
    });
    return articles;
  } catch (error) {
    console.error('Error fetching user articles:', error);
    return [];
  }
}

// Admin actions
export async function getPendingArticles(userId: string): Promise<Article[]> {
  if (!await verifyAdmin(userId)) {
    throw new Error('Unauthorized');
  }
  try {
    const q = query(collection(db, 'articles'), where('status', '==', 'pending'), orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);
    const articles: Article[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      articles.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
      } as Article);
    });
    return articles;
  } catch (error) {
    console.error('Error fetching pending articles:', error);
    return [];
  }
}

export async function approveArticle(userId: string, articleId: string) {
  if (!await verifyAdmin(userId)) {
    throw new Error('Unauthorized');
  }
  try {
    const articleRef = doc(db, 'articles', articleId);
    await updateDoc(articleRef, { status: 'approved' });
  } catch (error) {
    console.error('Error approving article:', error);
    throw new Error('Failed to approve article.');
  }
}

export async function rejectArticle(userId: string, articleId: string, reason: string) {
  if (!await verifyAdmin(userId)) {
    throw new Error('Unauthorized');
  }
  try {
    const articleRef = doc(db, 'articles', articleId);
    await updateDoc(articleRef, { status: 'rejected', rejectionReason: reason });
  } catch (error) {
    console.error('Error rejecting article:', error);
    throw new Error('Failed to reject article.');
  }
}


export type AdminDashboardStats = {
    totalTests: number;
    averageWpm: number;
    averageAccuracy: number;
    testsByDate: { date: string; count: number }[];
    testsByDifficulty: { difficulty: string; count: number }[];
};

export async function getAdminDashboardStats(userId: string): Promise<AdminDashboardStats> {
    if (!await verifyAdmin(userId)) {
        throw new Error('Unauthorized');
    }

    try {
        const sessionsCollection = collection(db, 'typing-sessions');
        const snapshot = await getDocs(sessionsCollection);
        
        let totalWpm = 0;
        let totalAccuracy = 0;
        const testsByDate: Record<string, number> = {};
        const testsByDifficulty: Record<string, number> = {};

        snapshot.forEach(doc => {
            const data = doc.data();
            totalWpm += data.wpm;
            totalAccuracy += data.accuracy;

            const date = data.timestamp.toDate().toISOString().split('T')[0]; // YYYY-MM-DD
            testsByDate[date] = (testsByDate[date] || 0) + 1;

            const difficulty = data.difficulty || 'unknown';
            testsByDifficulty[difficulty] = (testsByDifficulty[difficulty] || 0) + 1;
        });

        const totalTests = snapshot.size;
        const averageWpm = totalTests > 0 ? Math.round(totalWpm / totalTests) : 0;
        const averageAccuracy = totalTests > 0 ? Math.round(totalAccuracy / totalTests) : 0;

        return {
            totalTests,
            averageWpm,
            averageAccuracy,
            testsByDate: Object.entries(testsByDate)
                .map(([date, count]) => ({ date, count }))
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
            testsByDifficulty: Object.entries(testsByDifficulty)
                .map(([difficulty, count]) => ({ difficulty, count }))
                .sort((a, b) => b.count - a.count),
        };

    } catch (error) {
        console.error("Error fetching admin dashboard stats:", error);
        throw new Error("Failed to fetch dashboard data.");
    }
}


export type UserWithAdminStatus = {
    uid: string;
    email: string | undefined;
    displayName: string | undefined;
    photoURL: string | undefined;
    isAdmin: boolean;
};

export async function getUsersAndAdminStatus(userId: string): Promise<UserWithAdminStatus[]> {
    if (!await verifyAdmin(userId)) {
        throw new Error('Unauthorized');
    }
    
    try {
        const adminUids = await getAdminUids();
        const authAdmin = getAdminAuth();
        const userRecords = await authAdmin.listUsers();
        
        const users = userRecords.users.map(user => ({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            isAdmin: adminUids.includes(user.uid),
        }));

        return users;

    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error("Failed to fetch user data.");
    }
}

export async function setAdminStatus(adminUserId: string, targetUserId: string, isAdmin: boolean) {
    if (!await verifyAdmin(adminUserId)) {
        throw new Error('Unauthorized');
    }
    if (adminUserId === targetUserId) {
        throw new Error("Cannot change your own admin status.");
    }

    try {
        const adminDocRef = doc(db, 'app-settings', 'admins');
        
        if (isAdmin) {
            await updateDoc(adminDocRef, {
                uids: arrayUnion(targetUserId)
            });
        } else {
            await updateDoc(adminDocRef, {
                uids: arrayRemove(targetUserId)
            });
        }
    } catch (error) {
        console.error('Error updating admin status:', error);
        throw new Error("Failed to update admin status.");
    }
}
