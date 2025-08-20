// src/app/api/genkit/[...slug]/route.ts
import { ai } from "@/ai/genkit";
import { NextRequest } from "next/server";

const handler = ai.getApiHandler();

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  return handler(req, { params });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  return handler(req, { params });
}
