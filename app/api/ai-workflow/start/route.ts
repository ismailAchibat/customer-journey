import { getLanguageAndTranscription } from "@/services/ai-workflow";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const blob = await req.blob();
    const buffer = await blob.arrayBuffer();

    const result = await getLanguageAndTranscription({
      audio: buffer,
      audioContentType: blob.type,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ language: result.language, transcription: result.transcription });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
