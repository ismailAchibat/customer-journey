import { NextRequest, NextResponse } from 'next/server'

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY
const ELEVENLABS_TTS_URL = 'https://api.elevenlabs.io/v1/text-to-speech'

// Default model and voice (you can replace with yours)
const DEFAULT_VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2' // Alice voice
const DEFAULT_MODEL_ID = 'eleven_multilingual_v2'

export async function POST(req: NextRequest) {
  if (!ELEVENLABS_API_KEY) {
    return NextResponse.json({ ok: false, error: 'ELEVENLABS_API_KEY is not set' }, { status: 500 })
  }

  try {
    const body = await req.json()
    const { text, voice_id = DEFAULT_VOICE_ID, model_id = DEFAULT_MODEL_ID, output_format = 'mp3_44100_128' } = body

    if (!text) {
      return NextResponse.json({ ok: false, error: 'Missing "text" in request body' }, { status: 400 })
    }

    const response = await fetch(`${ELEVENLABS_TTS_URL}/${voice_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id,
        output_format,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      return NextResponse.json({ ok: false, error: `ElevenLabs error: ${response.status} - ${errText}` }, { status: 500 })
    }

    // ElevenLabs returns audio bytes (mp3)
    const audioBuffer = await response.arrayBuffer()
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'inline; filename="speech.mp3"',
      },
    })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 })
  }
}
