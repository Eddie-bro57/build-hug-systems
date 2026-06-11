import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

async function callAi(system: string, user: string, json = false) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      ...(json ? { response_format: { type: "json_object" } } : {}),
    }),
  });
  if (!res.ok) {
    if (res.status === 429) throw new Error("Too many AI requests — try again shortly.");
    if (res.status === 402) throw new Error("AI credits exhausted.");
    const t = await res.text();
    throw new Error(`AI error ${res.status}: ${t.slice(0, 200)}`);
  }
  const j = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return j.choices?.[0]?.message?.content ?? "";
}

export const quickFix = createServerFn({ method: "POST" })
  .inputValidator(z.object({ query: z.string().min(2).max(200) }))
  .handler(async ({ data }) => {
    const sys =
      "You are DoGuide QuickFix. Reply with a 30-second answer to a practical question. Be direct, safe, beginner-friendly. Return JSON.";
    const user = `Question: "${data.query}"\nReturn JSON: { "answer": "1-3 short sentences", "steps": ["3 to 5 short imperative bullets"], "warning": "optional one-line safety note or empty string" }.`;
    const content = await callAi(sys, user, true);
    const parsed = z
      .object({
        answer: z.string(),
        steps: z.array(z.string()),
        warning: z.string().optional().default(""),
      })
      .parse(JSON.parse(content));
    return parsed;
  });

export const troubleshoot = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      guideTitle: z.string(),
      stepTitle: z.string().optional(),
      problem: z.string().min(2).max(500),
    }),
  )
  .handler(async ({ data }) => {
    const sys =
      "You are DoGuide Troubleshooter. The user is in the middle of a guide and stuck. Help diagnose and recommend fixes.";
    const user = `Guide: "${data.guideTitle}"${data.stepTitle ? `\nCurrent step: "${data.stepTitle}"` : ""}\nProblem: "${data.problem}"\n\nGive 2-4 likely causes and a concrete fix for each, in plain language.`;
    const text = await callAi(sys, user, false);
    return { text };
  });
