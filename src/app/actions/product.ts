"use server";

import { translateText } from "@/ai/flows/translate-text";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  getDocs,
  orderBy,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { getLocale } from "next-intl/server";

export type Product = {
  id: string;
  name: Record<string, string>;
  brand: string;
  generation: string;
  layout: string;
  imageUrl: string;
  description: Record<string, string>;
  features: Record<string, string[]>;
  specs: Record<string, Record<string, string>>;
  originalLanguage: string;
};

async function translateProduct(
  product: Product,
  targetLocale: string
): Promise<Product> {
  const translatedProduct = { ...product };
  const needsTranslation = (field: keyof Product) =>
    !(product[field] as any)[targetLocale];

  const translationsToPerform: Promise<any>[] = [];
  const fieldsToUpdate: any = {};

  if (needsTranslation("name")) {
    translationsToPerform.push(
      translateText({
        text: product.name.en,
        targetLanguage: targetLocale,
      }).then((res) => ({ field: "name", value: res.translation }))
    );
  }
  if (needsTranslation("description")) {
    translationsToPerform.push(
      translateText({
        text: product.description.en,
        targetLanguage: targetLocale,
      }).then((res) => ({ field: "description", value: res.translation }))
    );
  }
  if (needsTranslation("features")) {
    translationsToPerform.push(
      Promise.all(
        product.features.en.map((feature) =>
          translateText({ text: feature, targetLanguage: targetLocale })
        )
      ).then((res) => ({
        field: "features",
        value: res.map((f) => f.translation),
      }))
    );
  }
  if (needsTranslation("specs")) {
    const specKeys = Object.keys(product.specs.en);
    const specValues = Object.values(product.specs.en);
    translationsToPerform.push(
      Promise.all(
        specValues.map((value) =>
          translateText({ text: value, targetLanguage: targetLocale })
        )
      ).then((translatedValues) => {
        const translatedSpecs: Record<string, string> = {};
        specKeys.forEach((key, index) => {
          translatedSpecs[key] = translatedValues[index].translation;
        });
        return { field: "specs", value: translatedSpecs };
      })
    );
  }

  const results = await Promise.all(translationsToPerform);

  results.forEach((result) => {
    (translatedProduct as any)[result.field][targetLocale] = result.value;
    fieldsToUpdate[`${result.field}.${targetLocale}`] = result.value;
  });

  if (Object.keys(fieldsToUpdate).length > 0) {
    updateDoc(doc(db, "products", product.id), fieldsToUpdate).catch(
      console.error
    );
  }

  return translatedProduct;
}

export async function getProducts(): Promise<Product[]> {
  try {
    const locale = await getLocale();
    const q = query(
      collection(db, "products"),
      orderBy("brand"),
      orderBy("name.en")
    );
    const querySnapshot = await getDocs(q);

    const products = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Product)
    );

    const translatedProducts = await Promise.all(
      products.map(async (product) => {
        if (product.name[locale] && product.description[locale]) {
          return product;
        }
        return await translateProduct(product, locale);
      })
    );

    return translatedProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let product = {
        id: docSnap.id,
        ...docSnap.data(),
      } as Product;

      const locale = await getLocale();
      if (!product.name[locale] || !product.description[locale]) {
        product = await translateProduct(product, locale);
      }
      return product;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}
