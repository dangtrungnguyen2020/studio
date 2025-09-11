"use server";

import { translateText } from "@/ai/flows/translate-text";
import { db, getUserClaims } from "@/lib/firebase-admin";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  getDoc,
  updateDoc,
  FieldValue,
} from "firebase/firestore";
import { getStorage as getAdminStorage } from "firebase-admin/storage";
import { getStorage } from "firebase/storage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { randomUUID } from "crypto";
import { getLocale } from "next-intl/server";
import { app } from "@/lib/firebase";
import { Article } from "@/domain/entities/article";
import { revalidatePath } from "next/cache";
import { verifyAdmin } from "./user";

async function getAdminUids(idToken: string) {
  const claims = await getUserClaims(idToken);
  if (!claims || (claims.role !== "admin" && claims.role !== "editor")) {
    return {
      error:
        "Permission Denied: Must be an admin or editor to create an article.",
    };
  }
  // const adminRef = await db.collection("app-settings").where({roles: "admins"});
  // const adminDoc = await adminRef.get();
  // if (adminDoc.exists) {
  //   return adminDoc.data()?.uids || [];
  // }
  return [];
}
/* 
async function verifyAdmin(userId: string): Promise<boolean> {
  const adminUids = await getAdminUids();
  return adminUids.includes(userId);
} */

export async function uploadImage(formData: FormData): Promise<string> {
  const file = formData.get("image") as File;
  if (!file) {
    throw new Error("No image provided");
  }
  const clientStorage = getStorage(app);
  const storageRef = ref(
    clientStorage,
    `articles/${randomUUID()}-${file.name}`
  );
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
}

export async function createArticle(data: {
  title: string;
  content: string;
  imageUrl: string;
  authorId: string;
  authorName: string;
  authorPhotoURL: string;
  language: string;
}) {
  try {
    const articleData: Omit<Article, "id" | "createdAt"> & {
      createdAt: FieldValue;
    } = {
      title: { [data.language]: data.title },
      content: { [data.language]: data.content },
      imageUrl: data.imageUrl,
      authorId: data.authorId,
      authorName: data.authorName,
      authorPhotoURL: data.authorPhotoURL,
      originalLanguage: data.language,
      status: "pending",
      createdAt: serverTimestamp(),
    };

    if (data.language !== "en") {
      const [titleTranslation, contentTranslation] = await Promise.all([
        translateText({ text: data.title, targetLanguage: "en" }),
        translateText({ text: data.content, targetLanguage: "en" }),
      ]);
      articleData.title!.en = titleTranslation.translation;
      articleData.content!.en = contentTranslation.translation;
    }
    const result = await db.collection("articles").add({
      ...articleData,
      createdAt: new Date(),
    });

    revalidatePath("/articles");
    return result;
  } catch (error) {
    console.error("Error creating article:", error);
    throw new Error("Failed to create article.");
  }
}

async function translateArticle(article: Article, targetLocale: string) {
  if (article.title[targetLocale] && article.content[targetLocale]) {
    return article;
  }

  const sourceTitle =
    article.title.en || article.title[article.originalLanguage];
  const sourceContent =
    article.content.en || article.content[article.originalLanguage];

  const [titleTranslation, contentTranslation] = await Promise.all([
    translateText({ text: sourceTitle, targetLanguage: targetLocale }),
    translateText({ text: sourceContent, targetLanguage: targetLocale }),
  ]);

  const updatedArticle = { ...article };
  updatedArticle.title[targetLocale] = titleTranslation.translation;
  updatedArticle.content[targetLocale] = contentTranslation.translation;

  const articleRef = db.collection("articles").doc(article.id);
  // const articleDoc = await articleRef.get();
  // if (!articleDoc.exists) {
  //   return { error: 'Article not found.' };
  // }

  await articleRef
    .update({
      [`title.${targetLocale}`]: titleTranslation.translation,
      [`content.${targetLocale}`]: contentTranslation.translation,
    })
    .catch(console.error);

  return updatedArticle;
}

export async function getArticles() {
  try {
    const locale = await getLocale();
    const q = db
      .collection("articles")
      .where("status", "==", "approved")
      .orderBy("createdAt", "desc");
    const querySnapshot = await q.get();
    const articles: Article[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      articles.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
      } as Article);
    });

    const translatedArticles = await Promise.all(
      articles.map(async (article) => {
        if (article.title[locale]) {
          return article;
        }
        return await translateArticle(article, locale);
      })
    );

    return translatedArticles;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

export async function getArticle(id: string) {
  try {
    const docRef = db.collection("articles").doc(id);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      let article = {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data()?.createdAt.toDate(),
      } as Article;

      const locale = await getLocale();
      if (!article.title[locale] || !article.content[locale]) {
        article = await translateArticle(article, locale);
      }
      return article;
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
    const q = db
      .collection("articles")
      .where("authorId", "==", userId)
      .orderBy("createdAt", "desc");
    const querySnapshot = await q.get();
    const articles: Article[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      articles.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        // Ensure title is an object, default to original language if somehow it's a string
        title:
          typeof data.title === "string"
            ? { [data.originalLanguage]: data.title }
            : data.title,
      } as Article);
    });
    return articles;
  } catch (error) {
    console.error("Error fetching user articles:", error);
    return [];
  }
}

// Admin actions
export async function getPendingArticles(userId: string): Promise<Article[]> {
  if (!(await verifyAdmin(userId))) {
    throw new Error("Unauthorized");
  }
  try {
    const q = db
      .collection("articles")
      .where("status", "==", "pending")
      .orderBy("createdAt", "asc");
    const querySnapshot = await q.get();
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
    console.error("Error fetching pending articles:", error);
    return [];
  }
}

export async function approveArticle(userId: string, articleId: string) {
  if (!(await verifyAdmin(userId))) {
    throw new Error("Unauthorized");
  }
  try {
    const articleRef = db.collection("articles").doc(articleId);
    const articleDoc = await articleRef.get();

    if (!articleDoc.exists) {
      return { error: "Article not found." };
    }
    await articleRef.update({ status: "approved" });
  } catch (error) {
    console.error("Error approving article:", error);
    throw new Error("Failed to approve article.");
  }
}

export async function rejectArticle(
  userId: string,
  articleId: string,
  reason: string
) {
  if (!(await verifyAdmin(userId))) {
    throw new Error("Unauthorized");
  }
  try {
    const articleRef = db.collection("articles").doc(articleId);
    const articleDoc = await articleRef.get();
    if (!articleDoc.exists) {
      return { error: "Article not found." };
    }
    await articleRef.update({ status: "rejected", rejectionReason: reason });
  } catch (error) {
    console.error("Error rejecting article:", error);
    throw new Error("Failed to reject article.");
  }
}
