
"use server";

import { generatePersonalizedExercises } from "@/ai/flows/personalized-typing-exercises";
import type { PersonalizedExercisesInput, PersonalizedExercisesOutput } from "@/ai/flows/personalized-typing-exercises";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { randomUUID } from "crypto";

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
  const storageRef = ref(storage, `articles/${randomUUID()}-${file.name}`);
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
};

export async function createArticle(data: Omit<Article, 'id' | 'createdAt'>) {
  try {
    const docRef = await addDoc(collection(db, "articles"), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating article:", error);
    throw new Error("Failed to create article.");
  }
}

export async function getArticles(): Promise<Article[]> {
  try {
    const q = query(collection(db, "articles"), orderBy("createdAt", "desc"));
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

