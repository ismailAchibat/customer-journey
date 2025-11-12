import { NextRequest, NextResponse } from "next/server";
import { runAiWorkflow } from "@/services/ai-workflow";

export async function POST(req: NextRequest) {
  try {
    const userId = "user_002"; // adapt as needed or extract from auth

    const contentType = req.headers.get("content-type") || "audio/webm";
    const arrayBuffer = await req.arrayBuffer();

    const result = await runAiWorkflow({
      userId,
      audio: arrayBuffer,
      audioContentType: contentType,
    });

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 500 }
      );
    }

    const formData = new FormData();
    formData.append(
      "audio",
      new Blob([result.audio], { type: result.audioContentType }),
      "ai-response.mp3"
    );
    formData.append("text", result.text);

    return new NextResponse(formData, {
      status: 200,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
