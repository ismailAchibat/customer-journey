import { Mistral } from "@mistralai/mistralai";

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_STT_URL = "https://api.elevenlabs.io/v1/speech-to-text";
const ELEVENLABS_TTS_URL = "https://api.elevenlabs.io/v1/text-to-speech";
const DEFAULT_VOICE_ID = "Xb7hH8MSUJpSbSDYk0k2"; // Alice voice
const DEFAULT_MODEL_ID = "eleven_multilingual_v2";
const DEFAULT_STT_MODEL_ID = "scribe_v1";

/**
 * Call Mistral API directly
 */
export async function completeMistralPrompt(prompt: string): Promise<string> {
  if (!MISTRAL_API_KEY) {
    throw new Error("MISTRAL_API_KEY is not set in environment");
  }

  const client = new Mistral({ apiKey: MISTRAL_API_KEY });

  const messages: any[] = [
    {
      role: "system",
      content:
        "You do not communicate directly with the user, so dont style your answers as if you were doing so. Instead, provide your response in a format that can be used by another system to communicate with the user. Keep your responses concise and to the point.",
    },
    { role: "user", content: prompt },
  ];

  const result = await client.chat.complete({
    model: "mistral-small-latest",
    messages,
  });

  const content =
    (result as any)?.choices?.[0]?.message?.content ??
    (result as any)?.choices?.[0]?.text ??
    (result as any)?.text ??
    (result as any)?.output?.[0]?.content ??
    null;

  if (!content) {
    throw new Error("No assistant message in Mistral response");
  }

  return content;
}

/**
 * Call ElevenLabs STT API directly
 */
export async function transcribeAudio(
  arrayBuffer: ArrayBuffer,
  contentType = "audio/wav"
): Promise<string> {
  if (!ELEVENLABS_API_KEY) {
    throw new Error("ELEVENLABS_API_KEY is not set");
  }

  const blob = new Blob([arrayBuffer], { type: contentType || "audio/wav" });
  const fd = new FormData();
  fd.append("file", blob, "audio.wav");
  fd.append("model_id", DEFAULT_STT_MODEL_ID);

  const elevenRes = await fetch(ELEVENLABS_STT_URL, {
    method: "POST",
    headers: {
      "xi-api-key": ELEVENLABS_API_KEY,
    },
    body: fd as any,
  });

  if (!elevenRes.ok) {
    const text = await elevenRes.text();
    throw new Error(`ElevenLabs STT error: ${elevenRes.status} - ${text}`);
  }

  const json = await elevenRes.json();
  const text = (json as any)?.text ?? (json as any)?.transcription ?? null;

  if (!text) {
    throw new Error("No text in ElevenLabs STT response");
  }

  return text;
}

/**
 * Call ElevenLabs TTS API directly
 */
export async function textToSpeech(
  text: string,
  voiceId = DEFAULT_VOICE_ID,
  modelId = DEFAULT_MODEL_ID,
  outputFormat = "mp3_44100_128"
): Promise<ArrayBuffer> {
  if (!ELEVENLABS_API_KEY) {
    throw new Error("ELEVENLABS_API_KEY is not set");
  }

  const response = await fetch(`${ELEVENLABS_TTS_URL}/${voiceId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": ELEVENLABS_API_KEY,
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      output_format: outputFormat,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`ElevenLabs TTS error: ${response.status} - ${errText}`);
  }

  return await response.arrayBuffer();
}
