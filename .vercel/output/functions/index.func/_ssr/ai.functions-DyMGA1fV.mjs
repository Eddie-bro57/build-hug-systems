import { c as createServerRpc } from "./createServerRpc-DcRUf6YZ.mjs";
import { c as createServerFn } from "./server-1c1s4yWy.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, a as arrayType, e as enumType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
async function callAi(system, user, json = false) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [{
        role: "system",
        content: system
      }, {
        role: "user",
        content: user
      }],
      ...json ? {
        response_format: {
          type: "json_object"
        }
      } : {}
    })
  });
  if (!res.ok) {
    if (res.status === 429) throw new Error("Too many AI requests — try again shortly.");
    if (res.status === 402) throw new Error("AI credits exhausted.");
    const t = await res.text();
    throw new Error(`AI error ${res.status}: ${t.slice(0, 200)}`);
  }
  const j = await res.json();
  return j.choices?.[0]?.message?.content ?? "";
}
const quickFix_createServerFn_handler = createServerRpc({
  id: "ddf3a97db7af5c8c9b645baecf6451a6f097d069fc5c7bf1dcfc444d6a95e5d8",
  name: "quickFix",
  filename: "src/lib/ai.functions.ts"
}, (opts) => quickFix.__executeServer(opts));
const quickFix = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  query: stringType().min(2).max(200)
})).handler(quickFix_createServerFn_handler, async ({
  data
}) => {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) {
    throw new Error("LOVABLE_API_KEY is not configured");
  }
  const sys = "You are DoGuide QuickFix. Reply with a 30-second answer to a practical question. Be direct, safe, beginner-friendly. Return JSON.";
  const user = `Question: "${data.query}"
Return JSON: { "answer": "1-3 short sentences", "steps": ["3 to 5 short imperative bullets"], "warning": "optional one-line safety note or empty string" }.`;
  const content = await callAi(sys, user, true);
  const parsed = objectType({
    answer: stringType(),
    steps: arrayType(stringType()),
    warning: stringType().optional().default("")
  }).parse(JSON.parse(content));
  return parsed;
});
async function callAiMessages(messages, json = false) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages,
      ...json ? {
        response_format: {
          type: "json_object"
        }
      } : {}
    })
  });
  if (!res.ok) {
    if (res.status === 429) throw new Error("Too many AI requests — try again shortly.");
    if (res.status === 402) throw new Error("AI credits exhausted.");
    const t = await res.text();
    throw new Error(`AI error ${res.status}: ${t.slice(0, 200)}`);
  }
  const j = await res.json();
  return j.choices?.[0]?.message?.content ?? "";
}
const MessageSchema = objectType({
  role: enumType(["user", "assistant"]),
  content: stringType()
});
const troubleshoot_createServerFn_handler = createServerRpc({
  id: "be859a15c39ba904bdf48e4e41378ba31a56c0fd609ddc630201b3f1c6171a43",
  name: "troubleshoot",
  filename: "src/lib/ai.functions.ts"
}, (opts) => troubleshoot.__executeServer(opts));
const troubleshoot = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  guideTitle: stringType(),
  stepTitle: stringType().optional(),
  problem: stringType().min(2).max(500),
  history: arrayType(MessageSchema).optional()
})).handler(troubleshoot_createServerFn_handler, async ({
  data
}) => {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) {
    throw new Error("LOVABLE_API_KEY is not configured");
  }
  const sys = "You are DoGuide Troubleshooter. The user is in the middle of a guide and stuck. Help diagnose and recommend fixes. Keep answers concise, safe, and beginner-friendly.";
  const messages = [{
    role: "system",
    content: sys
  }, {
    role: "user",
    content: `I am currently working on the guide: "${data.guideTitle}"${data.stepTitle ? ` at step "${data.stepTitle}"` : ""}.`
  }];
  if (data.history && data.history.length > 0) {
    data.history.forEach((m) => {
      messages.push({
        role: m.role,
        content: m.content
      });
    });
  }
  messages.push({
    role: "user",
    content: data.problem
  });
  const text = await callAiMessages(messages, false);
  return {
    text
  };
});
export {
  quickFix_createServerFn_handler,
  troubleshoot_createServerFn_handler
};
