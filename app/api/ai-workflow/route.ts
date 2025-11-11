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

    return new NextResponse(result.audio, {
      status: 200,
      headers: {
        "Content-Type": result.audioContentType || "audio/mpeg",
        "Content-Disposition": "inline; filename=ai-response.mp3",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
