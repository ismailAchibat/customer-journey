import { NextRequest, NextResponse } from "next/server";
import { Mistral } from "@mistralai/mistralai";

const API_KEY = process.env.MISTRAL_API_KEY;

const client = new Mistral({ apiKey: API_KEY });

async function completePrompt(prompt: string) {
  if (!API_KEY) throw new Error("MISTRAL_API_KEY is not set in environment");
  const messages: any[] = []

  // rules
  messages.push({
    role: 'system',
    content: 'You do not communicate directly with the user, so dont style your answers as if you were doing so. Instead, provide your response in a format that can be used by another system to communicate with the user. Keep your responses concise and to the point.'
  });

   // finally the user prompt
  messages.push({ role: 'user', content: prompt })

  const result = await client.chat.complete({
    model: "mistral-small-latest",
    messages

  });

  return result;
}

export async function GET() {
  const testPrompt = "Bonjour, introduisez-vous.";

  try {
    const data = await completePrompt(testPrompt);
    // extract assistant message content from common response shapes
    const content =
      (data as any)?.choices?.[0]?.message?.content ??
      (data as any)?.choices?.[0]?.text ??
      (data as any)?.text ??
      (data as any)?.output?.[0]?.content ??
      null;

    if (!content) {
      return NextResponse.json(
        { ok: false, error: "No assistant message in response" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, content });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = body?.prompt;
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { ok: false, error: "Missing `prompt` in request body" },
        { status: 400 }
      );
    }

    const data = await completePrompt(prompt);

    const content =
      (data as any)?.choices?.[0]?.message?.content ??
      (data as any)?.choices?.[0]?.text ??
      (data as any)?.text ??
      (data as any)?.output?.[0]?.content ??
      null;

    if (!content) {
      return NextResponse.json(
        { ok: false, error: "No assistant message in response" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, content });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
