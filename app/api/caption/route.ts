import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { vibe, alt } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
    }

    const prompt = `Write a single short, witty, internet-style meme caption. Keep it under 12 words. Style: ${vibe || "chaotic neutral"}. Image alt/description: ${alt || "unknown"}. Avoid offensive content.`;

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a clever meme copywriter." },
          { role: "user", content: prompt }
        ],
        temperature: 0.9,
        max_tokens: 32
      })
    });

    if (!resp.ok) {
      const txt = await resp.text();
      return NextResponse.json({ error: `OpenAI error: ${txt}` }, { status: 500 });
    }
    const data = await resp.json();
    const caption = data.choices?.[0]?.message?.content?.trim() ?? "";
    return NextResponse.json({ caption });
  } catch (e:any) {
    return NextResponse.json({ error: e.message || "Unknown error" }, { status: 500 });
  }
}
