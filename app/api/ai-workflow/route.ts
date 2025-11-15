import { NextRequest, NextResponse } from "next/server";
import { runAiWorkflow } from "@/services/ai-workflow";

export async function POST(req: NextRequest) {
  try {
    const userId = "user_002"; // adapt as needed or extract from auth
    const contentType = req.headers.get("content-type") || "";

    let result;
    if (contentType.includes("application/json")) {
      const { transcription } = await req.json();
      result = await runAiWorkflow({
        userId,
        transcription,
      });
    } else if (contentType.includes("audio")) {
      const arrayBuffer = await req.arrayBuffer();
      result = await runAiWorkflow({
        userId,
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
