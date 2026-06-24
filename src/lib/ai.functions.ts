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

export const chatWithAi = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      message: z.string().min(1).max(1000),
      history: z.array(
        z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        }),
      ),
      context: z
        .object({
          pathname: z.string().optional(),
          guideTitle: z.string().optional(),
          guideId: z.string().optional(),
          completedStepsCount: z.number().optional(),
          totalStepsCount: z.number().optional(),
          userXp: z.number().optional(),
          userLevel: z.number().optional(),
        })
        .optional(),
    }),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      if (process.env.NODE_ENV === "development") {
        console.warn("LOVABLE_API_KEY not configured. Using development chatWithAi mock.");
        const isGuidePage = data.context?.pathname?.includes("/guide/");
        const guideTitle = data.context?.guideTitle;
        
        let text = `Hello! I'm your DoGuide Coach (Mock Mode). It looks like you're on the page \`${data.context?.pathname ?? "/"}\`.`;
        const suggestedActions: Array<{ type: "generate_guide" | "chat_query"; query: string; label: string }> = [];
        
        if (isGuidePage && guideTitle) {
          text += `\n\nHow is it going with "**${guideTitle}**"? I can help you troubleshoot any step, or suggest safety precautions!`;
          suggestedActions.push({
            type: "chat_query",
            query: "What safety tips should I know?",
            label: "⚠️ Safety Guidelines",
          });
        } else {
          text += `\n\nWhat practical skill are you working on today? Tell me, and I can generate a custom guide for you.`;
          suggestedActions.push({
            type: "generate_guide",
            query: "How to juggle 3 balls",
            label: "✨ Generate Juggling Guide",
          });
          suggestedActions.push({
            type: "generate_guide",
            query: "How to brew espresso",
            label: "✨ Generate Espresso Guide",
          });
        }
        
        return { text, suggestedActions };
      }
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const sys =
      `You are "DoGuide Coach", a friendly and helpful AI mentor on the DoGuide practical learning platform. ` +
      `Your goal is to guide users to learn skills (e.g., Cooking, DIY, Fitness, Music, Technology, Health, Creative Arts, Travel). ` +
      `Maintain a supportive, encouraging, and clear tone.\n\n` +
      `You have access to the user's current context:\n` +
      `- URL Path: ${data.context?.pathname ?? "/"}\n` +
      `${data.context?.guideTitle ? `- Current Guide User is Viewing: "${data.context.guideTitle}"\n` : ""}` +
      `${data.context?.completedStepsCount !== undefined && data.context?.totalStepsCount !== undefined ? `- Progress: ${data.context.completedStepsCount} of ${data.context.totalStepsCount} steps completed\n` : ""}` +
      `${data.context?.userLevel ? `- User Level: ${data.context.userLevel} (${data.context.userXp ?? 0} XP)\n` : ""}\n` +
      `When talking to the user:\n` +
      `1. Reference their current context naturally if relevant. For example, if they are on a guide page, offer tips for that skill. If they are on their profile, cheer them on.\n` +
      `2. If they ask how to do a task or suggest a skill they want to learn, offer to generate a step-by-step guide for it.\n` +
      `3. Keep responses relatively concise (1-2 paragraphs) and use markdown formatting.\n\n` +
      `You MUST return a JSON object. Do not return any other text. The JSON format must be:\n` +
      `{\n` +
      `  "text": "Your markdown-formatted response text here.",\n` +
      `  "suggestedActions": [\n` +
      `     { "type": "generate_guide" | "chat_query", "query": "parameter value", "label": "visible button text" }\n` +
      `  ]\n` +
      `}\n\n` +
      `Use "generate_guide" when the user wants to generate a new guide (set the query to the topic name, e.g., "how to bake sourdough bread").\n` +
      `Use "chat_query" when offering user quick follow-up questions to ask you in this chat (set the query to the follow-up question text, e.g., "what tools do I need?").`;

    const messages = [
      { role: "system", content: sys }
    ];

    if (data.history && data.history.length > 0) {
      data.history.forEach(m => {
        messages.push({ role: m.role, content: m.content });
      });
    }

    messages.push({ role: "user", content: data.message });

    const content = await callAiMessages(messages, true);
    try {
      const parsed = JSON.parse(content);
      const validated = z.object({
        text: z.string(),
        suggestedActions: z.array(z.object({
          type: z.enum(["generate_guide", "chat_query"]),
          query: z.string(),
          label: z.string()
        })).optional().default([])
      }).parse(parsed);
      return validated;
    } catch (e) {
      console.error("AI response JSON parsing failed: ", content, e);
      return {
        text: content || "I'm sorry, I encountered an issue processing my thoughts. What else can I help you with?",
        suggestedActions: []
      };
    }
  });

