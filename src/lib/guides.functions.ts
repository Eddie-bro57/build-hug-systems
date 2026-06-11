import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const StepSchema = z.object({
  title: z.string(),
  detail: z.string(),
});

const GuideJsonSchema = z.object({
  title: z.string(),
  summary: z.string(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  time_minutes: z.number().int().positive().max(600),
  materials: z.array(z.string()),
  steps: z.array(StepSchema).min(3),
  tips: z.array(z.string()),
  video_query: z.string(),
});

const SYSTEM_PROMPT = `You are DoGuide, an expert that produces clear, friendly, step-by-step instructions for any practical task.
Always return practical, safe, beginner-friendly guidance. Steps must be concrete and ordered.
Return ONLY valid JSON matching the requested schema — no prose, no markdown.`;

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

async function callAi(userPrompt: string) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    if (res.status === 429) throw new Error("Too many AI requests — try again in a minute.");
    if (res.status === 402) throw new Error("AI credits exhausted. Please top up.");
    throw new Error(`AI gateway error ${res.status}: ${txt.slice(0, 200)}`);
  }
  const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return json.choices?.[0]?.message?.content ?? "{}";
}

export const generateGuide = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      query: z.string().min(2).max(200),
      category: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const userPrompt =
      `Task: "${data.query}"${data.category ? `\nCategory: ${data.category}` : ""}\n\n` +
      `Return JSON: { "title", "summary" (1-2 sentences), "difficulty" (Easy|Medium|Hard), "time_minutes" (integer), "materials" (array, may be empty), "steps" (array of {title, detail}, 5-12 steps), "tips" (array of short strings), "video_query" (short YouTube search phrase) }.`;

    const content = await callAi(userPrompt);
    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error("AI returned invalid JSON");
    }
    const guide = GuideJsonSchema.parse(parsed);

    // Persist via admin client so anonymous guests can also generate.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const baseSlug = slugify(guide.title) || slugify(data.query) || "guide";
    const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 7)}`;
    const category = data.category ?? "general";

    const { data: inserted, error } = await supabaseAdmin
      .from("guides")
      .insert({
        slug,
        title: guide.title,
        summary: guide.summary,
        category,
        difficulty: guide.difficulty,
        time_minutes: guide.time_minutes,
        materials: guide.materials,
        steps: guide.steps,
        tips: guide.tips,
        video_query: guide.video_query,
        is_published: true,
      })
      .select("id, slug")
      .single();

    if (error) throw new Error(`Failed to save guide: ${error.message}`);
    return inserted;
  });
