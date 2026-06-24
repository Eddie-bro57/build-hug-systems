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
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      if (process.env.NODE_ENV === "development") {
        console.warn("LOVABLE_API_KEY not configured. Using development mock fallback.");
        const title = data.query.replace(/how to /i, "").replace(/how do i /i, "").replace(/\?/g, "");
        const formattedTitle = title.charAt(0).toUpperCase() + title.slice(1);
        const category = data.category ?? "general";

        const mockGuide = {
          title: `How to ${formattedTitle}`,
          summary: `A development mock tutorial on ${formattedTitle.toLowerCase()} for testing the platform locally.`,
          difficulty: "Easy" as const,
          time_minutes: 15,
          materials: [
            "Basic preparation kit",
            "General safety guidelines documentation",
            "Local test workspace"
          ],
          steps: [
            { title: "Prep & Workspace Setup", detail: `Locate a suitable area and arrange your tools to begin learning ${formattedTitle.toLowerCase()}.` },
            { title: "Safety Inspection", detail: "Read basic guidelines and double check that all utilities and gear are fully ready." },
            { title: "Execute Core Task", detail: "Perform the primary action item following the recommended standard practice." },
            { title: "Verification", detail: "Test the results of your execution and resolve any obvious misalignments." },
            { title: "Completion & Clean Up", detail: "Tidy up your space and reward yourself for completing this guide step!" }
          ],
          tips: [
            "Double check safety precautions before starting.",
            "Take regular breaks if the skill is complex."
          ],
          video_query: `${formattedTitle} beginners tutorial`
        };

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const baseSlug = slugify(mockGuide.title) || slugify(data.query) || "guide";
        const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 7)}`;

        const { data: inserted, error } = await supabaseAdmin
          .from("guides")
          .insert({
            slug,
            title: mockGuide.title,
            summary: mockGuide.summary,
            category,
            difficulty: mockGuide.difficulty,
            time_minutes: mockGuide.time_minutes,
            materials: mockGuide.materials,
            steps: mockGuide.steps,
            tips: mockGuide.tips,
            video_query: mockGuide.video_query,
            is_published: true,
          })
          .select("id, slug")
          .single();

        if (error) throw new Error(`Failed to save guide: ${error.message}`);
        return inserted;
      }
      throw new Error("LOVABLE_API_KEY is not configured");
    }

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

export const searchGuides = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      query: z.string().min(1),
      category: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let req = supabaseAdmin
      .from("guides")
      .select("id, slug, title, summary, category, difficulty, time_minutes")
      .eq("is_published", true);
    if (data.category) {
      req = req.eq("category", data.category);
    }
    const { data: guides, error } = await req;
    if (error) throw new Error(`Database error: ${error.message}`);

    const apiKey = process.env.LOVABLE_API_KEY;

    // Helper for keyword fallback search
    const getFallbackResults = () => {
      const q = data.query.toLowerCase();
      return guides
        .map((g) => {
          let score = 0;
          if (g.title.toLowerCase().includes(q)) score += 10;
          if (g.summary.toLowerCase().includes(q)) score += 5;
          const words = q.split(/\s+/);
          words.forEach((w) => {
            if (g.title.toLowerCase().includes(w)) score += 2;
            if (g.summary.toLowerCase().includes(w)) score += 1;
          });
          return { ...g, score };
        })
        .filter((g) => g.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ score, ...g }) => g)
        .slice(0, 20);
    };

    if (!apiKey || guides.length <= 1) {
      return getFallbackResults();
    }

    try {
      const userPrompt =
        `Search Query: "${data.query}"\n\n` +
        `Available Guides:\n` +
        guides.map((g, idx) => `[Index ${idx}] ID: ${g.id} | Title: "${g.title}" | Summary: "${g.summary}"`).join("\n") +
        `\n\nRank the guides by relevance to the search query. Return a JSON object with a single key "rankedIds" containing the IDs of the guides in order of relevance, starting with the most relevant. Only include guides that have at least some relevance to the search query.\n\n` +
        `Return JSON format: { "rankedIds": ["uuid-1", "uuid-2"] }`;

      const content = await callAi(userPrompt);
      const parsed = JSON.parse(content);
      const validated = z
        .object({
          rankedIds: z.array(z.string()),
        })
        .parse(parsed);

      const idMap = new Map(guides.map((g) => [g.id, g]));
      const rankedGuides = validated.rankedIds
        .map((id) => idMap.get(id))
        .filter((g): g is typeof guides[number] => !!g);

      if (rankedGuides.length > 0) {
        return rankedGuides;
      }
    } catch (e) {
      console.warn("Semantic search failed, falling back to keyword search:", e);
    }

    return getFallbackResults();
  });

