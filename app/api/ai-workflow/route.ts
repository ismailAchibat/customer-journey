import { NextRequest, NextResponse } from "next/server";
import { runAiWorkflow } from "@/services/ai-workflow";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let result;
    if (contentType.includes("application/json")) {
      const { transcription, userId } = await req.json();
      result = await runAiWorkflow({
        userId: userId || "user_002", // Fallback for safety
        transcription,
      });
    } else if (contentType.includes("audio")) {
      // This path seems to be handled by /api/ai-workflow/start now
      // Keeping it for now but may need cleanup
      const arrayBuffer = await req.arrayBuffer();
      result = await runAiWorkflow({
        userId: "user_002", // No user context here
        audio: arrayBuffer,
        audioContentType: contentType,
      });
    } else {
      return NextResponse.json(
        { ok: false, error: "Unsupported content-type" },
        { status: 400 }
      );
    }

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
