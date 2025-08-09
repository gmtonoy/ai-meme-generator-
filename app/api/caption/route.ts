export const runtime = "nodejs";

type ReqBody = { vibe?: string; alt?: string };

/**
 * Handles POST requests to generate a meme caption using Google Gemini.
 *
 * The request body should include a `vibe` (tone of the caption) and an `alt`
 * description of what is happening in the image. The function uses these
 * values to construct a prompt and calls the Gemini API to generate a
 * caption. It returns a JSON object with either a `caption` or an `error`.
 */
export async function POST(req: Request) {
  try {
    const { vibe = "playful", alt = "" } = (await req.json()) as ReqBody;

    // Ensure the Gemini API key is available
    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: "Missing GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    // Validate the image description (alt text)
    if (!alt.trim()) {
      return Response.json(
        { error: "Missing 'alt' description" },
        { status: 400 }
      );
    }

    // Build a prompt for Gemini to generate a funny caption
    const prompt = [
      "You write short, funny meme captions.",
      `Vibe: ${vibe}.`,
      `Image description: ${alt}.`,
      "Return ONE caption only, under 100 characters, no quotes.",
    ].join(" ");

    // Call the Gemini API
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      }
    );

    // If the API call fails, return an error
    if (!resp.ok) {
      const text = await resp.text();
      return Response.json(
        { error: `Gemini error: ${resp.status} ${text}` },
        { status: 502 }
      );
    }

    const data = await resp.json();
    const caption =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? null;

    if (!caption) {
      return Response.json(
        { error: "No caption returned" },
        { status: 502 }
      );
    }

    return Response.json({ caption });
  } catch (err: any) {
    return Response.json(
      { error: err?.message ?? "Server error" },
      { status: 500 }
    );
  }
}
