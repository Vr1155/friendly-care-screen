export async function elevenSpeak(text: string) {
  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${import.meta.env.VITE_ELEVENLABS_VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": import.meta.env.VITE_ELEVENLABS_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2",
          voice_settings: { stability: 0.7, similarity_boost: 0.9 },
        }),
      }
    );
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    await audio.play();
  } catch (err) {
    console.error("ElevenLabs TTS error:", err);
  }
}
