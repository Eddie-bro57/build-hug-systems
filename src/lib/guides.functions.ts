import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const StepSchema = z.object({
  title: z.string(),
  detail: z.string(),
});

const GuideSchema = z.object({
  title: z.string(),
  summary: z.string(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  time_estimate: z.string(),
  materials: z.array(z.string()),
  steps: z.array(StepSchema).min(3),
  tips: z.array(z.string()),
  video_query: z.string(),
});

export type Guide = z.infer<typeof GuideSchema>;

const SYSTEM_PROMPT = `You are DoGuide, an expert that produces clear, friendly, step-by-step instructions for any task a person might want to do.
Always return practical, safe, beginner-friendly guidance. Steps must be concrete and ordered.
Return ONLY valid JSON matching the provided schema — no prose, no markdown.`;

export const generateGuide = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      query: z.string().min(2).max(200),
      category: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

    const userPrompt = `Task: "${data.query}"${
      data.category ? `\nCategory: ${data.category}` : ""
    }\n\nReturn a JSON guide with: title, summary (1-2 sentences), difficulty (Easy|Medium|Hard), time_estimate (e.g. "15 minutes"), materials (array, may be empty), steps (array of {title, detail}, at least 5 steps), tips (array of short helpful tips), video_query (a short YouTube search phrase).`;

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
      throw new Error(`AI gateway error ${res.status}: ${txt.slice(0, 200)}`);
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = json.choices?.[0]?.message?.content ?? "{}";
    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error("AI returned invalid JSON");
    }
    const guide = GuideSchema.parse(parsed);
    return guide;
  });
