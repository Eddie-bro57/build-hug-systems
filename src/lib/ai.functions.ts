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
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      if (process.env.NODE_ENV === "development") {
        console.warn("LOVABLE_API_KEY not configured. Using development quickFix mock.");
        return {
          answer: `Here is a local development quick fix recommendation for "${data.query}".`,
          steps: [
            "Check physical and/or digital connections first to isolate the issue.",
            "Power cycle the involved equipment or refresh your software cache.",
            "Verify settings match the default values in your reference guides."
          ],
          warning: "Running in mock mode because LOVABLE_API_KEY is not configured in .env"
        };
      }
      throw new Error("LOVABLE_API_KEY is not configured");
    }

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

async function callAiMessages(messages: { role: string; content: string }[], json = false) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages,
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

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

export const troubleshoot = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      guideTitle: z.string(),
      stepTitle: z.string().optional(),
      problem: z.string().min(2).max(500),
      history: z.array(MessageSchema).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      if (process.env.NODE_ENV === "development") {
        console.warn("LOVABLE_API_KEY not configured. Using development troubleshoot mock.");
        return {
          text: `[Mock Troubleshooter Mode]\n\nYou are working on: "${data.guideTitle}"\nProblem: "${data.problem}"\n\nPossible Causes & Fixes:\n1. Incorrect technique or alignment\n   Fix: Slow down and re-check steps.\n2. Incomplete prerequisites\n   Fix: Double check that you completed all materials checks.`
        };
      }
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const sys =
      "You are DoGuide Troubleshooter. The user is in the middle of a guide and stuck. Help diagnose and recommend fixes. Keep answers concise, safe, and beginner-friendly.";
    
    const messages = [
      { role: "system", content: sys },
      { role: "user", content: `I am currently working on the guide: "${data.guideTitle}"${data.stepTitle ? ` at step "${data.stepTitle}"` : ""}.` }
    ];

    if (data.history && data.history.length > 0) {
      data.history.forEach(m => {
        messages.push({ role: m.role, content: m.content });
      });
    }

    messages.push({ role: "user", content: data.problem });

    const text = await callAiMessages(messages, false);
    return { text };
  });
