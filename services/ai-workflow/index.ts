import {
  addCalendarEvent,
  getCalendarEventsById,
} from "@/services/database/calendar";
import { findClientByNameAndCompany } from "../database/clients";
import { getUserById } from "../database/users";
import { sendEmail } from "../email";
import {
  completeMistralPrompt,
  transcribeAudio,
  textToSpeech,
} from "@/lib/ai-services";

function extractFirstJson(text: string) {
  // crude: find first { ... } balanced braces and parse
  const start = text.indexOf("{");
  if (start === -1) return null;
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (ch === "{") depth++;
    if (ch === "}") depth--;
    if (depth === 0) {
      const substr = text.slice(start, i + 1);
      try {
        return JSON.parse(substr);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
}

async function callStt(arrayBuffer: ArrayBuffer, contentType = "audio/wav") {
  const text = await transcribeAudio(arrayBuffer, contentType);
  console.log("[ai-workflow] callStt response:", text);
  return text;
}

async function callMistral(prompt: string) {
  const content = await completeMistralPrompt(prompt);
  console.log("[ai-workflow] callMistral response:", content);
  return content;
}

async function callTts(text: string) {
  const arrayBuffer = await textToSpeech(text);
  console.log(
    "[ai-workflow] callTts returned audio bytes:",
    arrayBuffer?.byteLength ?? 0
  );
  return arrayBuffer;
}

export type RunAiWorkflowResult =
  | {
      ok: true;
      audio: ArrayBuffer;
      audioContentType: string;
      text: string;
      metadata: any;
    }
  | {
      ok: false;
      error: string;
    };

/**
 * Run the AI assistant workflow.
 * - If `transcription` is provided, STT is skipped.
 * - If `audio` (ArrayBuffer) is provided, it will be sent to the STT endpoint.
 */
export async function runAiWorkflow(opts: {
  userId: string;
  audio?: ArrayBuffer;
  audioContentType?: string;
  transcription?: string;
}): Promise<RunAiWorkflowResult> {
  try {
    const { userId, audio, audioContentType, transcription } = opts;
    if (!userId) return { ok: false, error: "Missing userId" };

    let textCommand = transcription ?? null;
    if (!textCommand) {
      if (!audio) return { ok: false, error: "Missing audio or transcription" };
      textCommand = await callStt(audio, audioContentType);
      console.log("[ai-workflow] STT transcription:", textCommand);
    }

    // 1) Parse the user's voice command into minimal JSON
    const parsePrompt = `Extract the calendar intent from this command as a JSON object with exactly these keys: subject, client_name, client_company, duration, language. "language" should be the detected language of the command (e.g., "English", "French"). Use ISO-like/simple values and keep values concise. Command: "${textCommand.replace(
      /\"/g,
      '\\"'
    )}"`;
    const parseContent = await callMistral(parsePrompt);
    console.log("[ai-workflow] parseContent from Mistral:", parseContent);
    const parsed =
      extractFirstJson(parseContent) ??
      (() => {
        try {
          return JSON.parse(parseContent);
        } catch {
          return null;
        }
      })();
    console.log("[ai-workflow] parsed intent:", parsed);
    if (!parsed)
      return {
        ok: false,
        error: "Failed to parse intent JSON from Mistral response",
      };

    let client = null;
    // New step: find the client in DB
    if (parsed.client_name) {
      const organisation_id = "org_001"; // TODO: fetch from user profile
      if (organisation_id) {
        client = await findClientByNameAndCompany({
          name: parsed.client_name,
          company: parsed.client_company,
          organisation_id,
        });
        console.log(
          "[ai-workflow] looked up client in DB: " + parsed.client_name,
          parsed.client_company,
          organisation_id
        );
        console.log("[ai-workflow] found client:", client);
      }
    }

    // 2) fetch calendar events
    const events = await getCalendarEventsById(userId).catch((e: any) => []);
    console.log(
      "[ai-workflow] fetched calendar events count:",
      events?.length ?? 0,
      "sample:",
      events?.slice?.(0, 3) ?? events
    );

    // 3) Ask Mistral to pick a date/time and return a confirmatory JSON + natural response
    const calendarStr = JSON.stringify(events.slice(0, 30));
    const language = parsed.language || "French";
    const schedulePrompt = `You are given an intent JSON and the user's upcoming calendar events (as JSON array). Choose the next available slot that fits the requested duration and return a JSON object with keys: natural_response, subject, client_name, date, time, duration. natural_response should be a short sentence confirming when you'll add the event and any relevant details, and also mention that an automatic email has been sent to the client to inform him of the meeting details. IMPORTANT: The natural_response MUST be written in ${language} and use common ${language} date/time expressions. Return ONLY the JSON object (no extra commentary). Intent: ${JSON.stringify(
      parsed
    )}; Events: ${calendarStr}. And pls it looks like you always give the wrong day of the week, so be sure to double-check that the day of week matches current date, TODAY IT'S WEDNSDAY 17 DECEMBER 2025, SO THE MEETING SHOULD BE SCHEDULED TODAY OR LATER.`;

    const scheduleContent = await callMistral(schedulePrompt);
    console.log("[ai-workflow] scheduleContent from Mistral:", scheduleContent);
    const finalJson =
      extractFirstJson(scheduleContent) ??
      (() => {
        try {
          return JSON.parse(scheduleContent);
        } catch {
          return null;
        }
      })();
    console.log("[ai-workflow] final scheduling JSON:", finalJson);
    if (!finalJson)
      return {
        ok: false,
        error: "Failed to parse scheduling JSON from Mistral response",
      };

    const addToCalendarTable = await addCalendarEvent({
      subject: finalJson.subject,
      client_name: finalJson.client_name,
      date: finalJson.date,
      time: finalJson.time,
      duration: finalJson.duration,
    });

    console.log(
      "[ai-workflow] added event to calendar Table: " + addToCalendarTable
    );

    // 4) Convert natural_response to speech
    const natural =
      finalJson?.natural_response ?? finalJson?.naturalResponse ?? null;
    console.log("[ai-workflow] natural response:", natural);
    if (!natural)
      return { ok: false, error: "No natural_response in final JSON" };

    const audioBuffer = await callTts(natural);
    console.log(
      "[ai-workflow] audioBuffer length:",
      audioBuffer?.byteLength ?? 0
    );

    // Send confirmation email
    if (client && client.email) {
      console.log(`[ai-workflow] Sending email to ${client.email}`);
      await sendEmail(
        {
          client_name: finalJson.client_name,
          date: finalJson.date,
          time: finalJson.time,
          subject: finalJson.subject,
          duration: finalJson.duration,
        },
        client.email
      );
    } else {
      console.log(
        "[ai-workflow] Skipping email: client or client email not found."
      );
    }

    return {
      ok: true,
      audio: audioBuffer,
      audioContentType: "audio/mpeg",
      text: natural,
      metadata: finalJson,
    };
  } catch (err: any) {
    console.error("[ai-workflow] runAiWorkflow error:", err);
    return { ok: false, error: err?.message ?? String(err) };
  }
}

export async function getLanguageAndTranscription(opts: {
  audio?: ArrayBuffer;
  audioContentType?: string;
}): Promise<
  | { ok: true; language: string; transcription: string }
  | { ok: false; error: string }
> {
  try {
    const { audio, audioContentType } = opts;
    if (!audio) return { ok: false, error: "Missing audio" };

    const textCommand = await callStt(audio, audioContentType);
    console.log("[ai-workflow] STT transcription:", textCommand);

    // This is duplicated from runAiWorkflow. Maybe I can refactor it.
    const parsePrompt = `Extract the calendar intent from this command as a JSON object with exactly these keys: subject, client_name, duration, language. "language" should be the detected language of the command (e.g., "English", "French"). Use ISO-like/simple values and keep values concise. Command: "${textCommand.replace(
      /\"/g,
      '\\"'
    )}"`;
    const parseContent = await callMistral(parsePrompt);
    console.log("[ai-workflow] parseContent from Mistral:", parseContent);
    const parsed =
      extractFirstJson(parseContent) ??
      (() => {
        try {
          return JSON.parse(parseContent);
        } catch {
          return null;
        }
      })();
    console.log("[ai-workflow] parsed intent:", parsed);
    if (!parsed)
      return {
        ok: false,
        error: "Failed to parse intent JSON from Mistral response",
      };

    const language = parsed.language || "French";

    return { ok: true, language, transcription: textCommand };
  } catch (err: any) {
    console.error("[ai-workflow] getLanguageAndTranscription error:", err);
    return { ok: false, error: err?.message ?? String(err) };
  }
}
