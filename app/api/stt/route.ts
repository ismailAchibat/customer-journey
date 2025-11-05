import { NextRequest, NextResponse } from 'next/server'

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY
const ELEVENLABS_STT_URL = 'https://api.elevenlabs.io/v1/speech-to-text'

export async function POST(req: NextRequest) {
  if (!ELEVENLABS_API_KEY) {
    return NextResponse.json({ ok: false, error: 'ELEVENLABS_API_KEY is not set' }, { status: 500 })
  }

  try {
    const contentType = req.headers.get('content-type') || ''
    const DEFAULT_MODEL_ID = 'scribe_v1'
    let elevenRes: Response

    if (contentType.includes('multipart/form-data')) {
      // Handle multipart form (e.g., from HTML form)
      const form = await req.formData()
      const forward = new FormData()

      let hasModel = false
      for (const [key, value] of form.entries()) {
        forward.append(key, value as any)
        if (key === 'model_id' || key === 'model') hasModel = true
      }
      if (!hasModel) forward.append('model_id', DEFAULT_MODEL_ID)

      elevenRes = await fetch(ELEVENLABS_STT_URL, {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: forward as any,
      })
    } else {
      // Handle raw audio
      const arrayBuffer = await req.arrayBuffer()
      const blob = new Blob([arrayBuffer], { type: contentType || 'audio/wav' })
      const fd = new FormData()
      fd.append('file', blob, 'audio.wav')
      fd.append('model_id', DEFAULT_MODEL_ID)

      elevenRes = await fetch(ELEVENLABS_STT_URL, {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: fd as any,
      })
    }

    if (!elevenRes.ok) {
      const text = await elevenRes.text()
      return NextResponse.json({ ok: false, error: `ElevenLabs error: ${elevenRes.status} - ${text}` }, { status: 500 })
    }

    const json = await elevenRes.json()
    const text = (json as any)?.text ?? (json as any)?.transcription ?? null

    if (!text) {
      return NextResponse.json({ ok: false, error: 'No text in ElevenLabs response', raw: json }, { status: 500 })
    }

    return NextResponse.json({ ok: true, text })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 })
  }
}
