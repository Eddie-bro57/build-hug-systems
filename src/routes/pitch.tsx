import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Layers,
  Search,
  BookOpen,
  Smartphone,
  Cpu,
  TrendingUp,
  Compass,
  Zap,
  Users,
  ArrowRight,
  ShieldCheck,
  Video,
  FileText,
  Sparkles
} from "lucide-react";

export const Route = createFileRoute("/pitch")({
  head: () => ({
    meta: [
      { title: "DoGuide Pitch Deck — Investor & Team Presentation" },
      {
        name: "description",
        content: "A detailed 10-slide pitch deck highlighting DoGuide's core MVP features, user flows, target personas, and roadmap.",
      },
    ],
  }),
  component: PitchDeckPage,
});

type Slide = {
  id: number;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  content: React.ReactNode;
};

function PitchDeckPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    // Slide 1: Cover
    {
      id: 1,
      title: "DoGuide",
      subtitle: "Do anything, learn anything.",
      icon: <Compass className="h-6 w-6 text-[#ff6f61]" />,
      content: (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 items-center h-full">
          <div className="md:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-widest">
              Pitch Deck · MVP Version 1.0
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight text-white md:text-7xl leading-none">
              Empowering Anyone to{" "}
              <span className="bg-gradient-to-r from-[#ff6f61] via-[#f59e0b] to-[#6366f1] bg-clip-text text-transparent">
                Master Practical Skills
              </span>
            </h1>
            <p className="text-lg text-slate-300 max-w-xl">
              DoGuide delivers structured, easy-to-follow, step-by-step practical instructions 
              integrated with video guidance, helping users accomplish daily tasks without stress.
            </p>
            <div className="pt-4 flex flex-wrap gap-4 text-sm text-slate-400">
              <div><strong>Status:</strong> Draft 1.0</div>
              <div className="hidden sm:block text-slate-600">•</div>
              <div><strong>Target Release:</strong> June 2026</div>
              <div className="hidden sm:block text-slate-600">•</div>
              <div className="text-[#ff6f61] font-medium">Confidential</div>
            </div>
          </div>
          <div className="md:col-span-5 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-3xl filter blur-2xl -z-10" />
            <img
              src="/pitch_hero.png"
              alt="People cooking together in a kitchen"
              className="rounded-3xl border border-white/10 shadow-2xl w-full object-cover aspect-[4/3]"
            />
          </div>
        </div>
      )
    },
    // Slide 2: The Problem
    {
      id: 2,
      title: "The Problem",
      subtitle: "The Friction of Learning Everyday Tasks",
      icon: <FileText className="h-6 w-6 text-rose-500" />,
      content: (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 items-center h-full">
          <div className="md:col-span-7 space-y-6">
            <h3 className="text-2xl font-bold text-white">Why is learning simple skills so frustrating?</h3>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-500/10 text-rose-400">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Fragmented, Unstructured Content</h4>
                  <p className="text-sm text-slate-300 mt-1">
                    Beginners waste time navigating through bloated blog posts, ads, and overly long video tutorials to find simple answers.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-500/10 text-rose-400">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Confidence & Beginner Overwhelm</h4>
                  <p className="text-sm text-slate-300 mt-1">
                    Traditional resources assume prior context, creating friction and discouragement for those who just want to complete a task.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-500/10 text-rose-400">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Time Constraints</h4>
                  <p className="text-sm text-slate-300 mt-1">
                    Busy adults don't want a 20-minute masterclass; they want a concise 30-second checklist to fix a leaky sink or bake bread.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="md:col-span-5 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-red-500/10 rounded-3xl filter blur-2xl -z-10" />
            <img
              src="/pitch_problem.png"
              alt="Frustrated person in front of a laptop"
              className="rounded-3xl border border-white/10 shadow-2xl w-full object-cover aspect-[4/3]"
            />
          </div>
        </div>
      )
    },
    // Slide 3: The Solution
    {
      id: 3,
      title: "The Solution",
      subtitle: "Introducing DoGuide",
      icon: <Zap className="h-6 w-6 text-amber-500" />,
      content: (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 items-center h-full">
          <div className="md:col-span-7 space-y-6">
            <h3 className="text-2xl font-bold text-white">A Structured Mobile Experience to Get Things Done</h3>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-500/10 text-amber-400">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Categorized & Discoverable Guides</h4>
                  <p className="text-sm text-slate-300 mt-1">
                    Clear activity tiles and intuitive search paths guide the user instantly to the relevant topic, completely ad-free.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Bite-Sized, Plain-Language Steps</h4>
                  <p className="text-sm text-slate-300 mt-1">
                    Every task is broken down into 4 to 20 numbered checkpoints written in simple language with zero industry jargon.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Video className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Integrated Video Assistance</h4>
                  <p className="text-sm text-slate-300 mt-1">
                    Embedded, high-quality video demonstrations playing alongside written steps to provide visual confirmation.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="md:col-span-5 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 rounded-3xl filter blur-2xl -z-10" />
            <img
              src="/pitch_success.png"
              alt="Confident person smiling with smartphone"
              className="rounded-3xl border border-white/10 shadow-2xl w-full object-cover aspect-[4/3]"
            />
          </div>
        </div>
      )
    },
    // Slide 4: Target Personas
    {
      id: 4,
      title: "Target Personas",
      subtitle: "Designing for Key User Demographics",
      icon: <Users className="h-6 w-6 text-[#6366f1]" />,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          {/* Persona 1 */}
          <div className="flex flex-col justify-between p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-24 w-24 bg-primary/10 rounded-full filter blur-xl group-hover:bg-primary/20 transition-colors" />
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">Primary Persona</span>
                  <h3 className="text-2xl font-bold text-white mt-1">The Curious Beginner</h3>
                </div>
                <div className="text-right text-xs text-slate-400">
                  <div>18 – 35 years</div>
                  <div>Comfort: High</div>
                </div>
              </div>
              <div className="mt-6 space-y-3 text-sm">
                <div>
                  <strong className="text-slate-200">Goal:</strong> Learn new skills or complete unfamiliar tasks with confidence.
                </div>
                <div>
                  <strong className="text-slate-200">Pain Point:</strong> Overwhelmed by unstructured online content; unsure where to start.
                </div>
                <div>
                  <strong className="text-slate-200">Typical Tasks:</strong> Cooking a new recipe, learning guitar chords, starting a workout routine.
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 text-xs text-slate-400">
              💡 Value Proposition: Step-by-step confidence building
            </div>
          </div>

          {/* Persona 2 */}
          <div className="flex flex-col justify-between p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-24 w-24 bg-purple-500/10 rounded-full filter blur-xl group-hover:bg-purple-500/20 transition-colors" />
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">Secondary Persona</span>
                  <h3 className="text-2xl font-bold text-white mt-1">The Busy Adult</h3>
                </div>
                <div className="text-right text-xs text-slate-400">
                  <div>30 – 55 years</div>
                  <div>Comfort: Low-Med</div>
                </div>
              </div>
              <div className="mt-6 space-y-3 text-sm">
                <div>
                  <strong className="text-slate-200">Goal:</strong> Quickly get instructions for tasks without spending time searching.
                </div>
                <div>
                  <strong className="text-slate-200">Pain Point:</strong> Lacks time to watch long tutorials; needs concise, actionable guidance.
                </div>
                <div>
                  <strong className="text-slate-200">Typical Tasks:</strong> Home repairs, simple DIY projects, event planning basics.
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 text-xs text-slate-400">
              💡 Value Proposition: Instant, direct, and straightforward checklist answers
            </div>
          </div>
        </div>
      )
    },
    // Slide 5: Core User Flow
    {
      id: 5,
      title: "Core User Flow",
      subtitle: "The 4-Step Journey to Success",
      icon: <Layers className="h-6 w-6 text-cyan-400" />,
      content: (
        <div className="flex flex-col justify-center h-full space-y-8">
          <h3 className="text-2xl font-bold text-white text-center">Seamless Navigation in 4 Steps</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: "01",
                name: "Home Page",
                desc: "User opens the app and views categorised activity tiles alongside a global search bar.",
                color: "border-[#ff6f61]/30 bg-[#ff6f61]/5"
              },
              {
                step: "02",
                name: "Category Selection",
                desc: "User selects a category card of interest to see popular guides and a category-scoped search.",
                color: "border-amber-500/30 bg-amber-50/5"
              },
              {
                step: "03",
                name: "Search & Select",
                desc: "User searches for a specific guide using fuzzy matching. Selects guide from clear summaries list.",
                color: "border-emerald-500/30 bg-emerald-50/5"
              },
              {
                step: "04",
                name: "Step-by-Step Guide",
                desc: "Follows numbered steps with progress indication, supplemented by embedded video guides.",
                color: "border-indigo-500/30 bg-indigo-50/5"
              }
            ].map((f, i) => (
              <div key={i} className={`p-5 rounded-3xl border ${f.color} backdrop-blur-md flex flex-col justify-between`}>
                <div>
                  <div className="text-3xl font-extrabold text-white/20 mb-2">{f.step}</div>
                  <h4 className="font-bold text-white text-base">{f.name}</h4>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{f.desc}</p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                  Next Step <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            ))}
          </div>
          <div className="text-center text-xs text-slate-400 italic pt-2">
            * Meets the Usability SLA: All primary actions reachable within 3 taps from the Home screen.
          </div>
        </div>
      )
    },
    // Slide 6: Core MVP Features
    {
      id: 6,
      title: "Core MVP Features",
      subtitle: "Functional Requirements Mapping",
      icon: <BookOpen className="h-6 w-6 text-emerald-400" />,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full items-center">
          {[
            {
              id: "F01 / F03",
              title: "Home & Category Pages",
              desc: "Visually organized activity tiles (Food, Music, Sports, etc.) and dedicated category pages with custom headers."
            },
            {
              id: "F02 / F04",
              title: "Global & Scoped Search",
              desc: "Full-text fuzzy matching search accessible from the homepage, alongside category-specific search bars for targeted results."
            },
            {
              id: "F05 / F06",
              title: "Interactive Guide & Video",
              desc: "Clean numbered steps with progress indicators, integrated with embedded video players for visual guides."
            }
          ].map((feat, idx) => (
            <div key={idx} className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md space-y-4">
              <div className="inline-flex items-center justify-center rounded-xl bg-white/10 px-3 py-1 text-xs font-bold text-slate-300">
                {feat.id}
              </div>
              <h4 className="text-xl font-bold text-white">{feat.title}</h4>
              <p className="text-sm text-slate-300 leading-relaxed">{feat.desc}</p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <ShieldCheck className="h-4 w-4" /> Must-Have Priority
              </div>
            </div>
          ))}
        </div>
      )
    },
    // Slide 7: Content & Quality
    {
      id: 7,
      title: "Content & Quality",
      subtitle: "Launch Curation & Content Standards",
      icon: <Layers className="h-6 w-6 text-purple-400" />,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center h-full">
          <div className="md:col-span-6 space-y-6">
            <h3 className="text-2xl font-bold text-white">Content Standards for Launch (MVP)</h3>
            <div className="space-y-4 text-sm">
              <div className="p-4 rounded-2xl border border-white/5 bg-white/5">
                <span className="font-semibold text-white block">Initial Launch Scope</span>
                <p className="text-slate-300 text-xs mt-1">
                  6 Categories: Food & Cooking, Music, Sports & Fitness, Technology, Health & Wellness, DIY & Home.
                </p>
              </div>
              <div className="p-4 rounded-2xl border border-white/5 bg-white/5">
                <span className="font-semibold text-white block">Strict Formatting Guidelines</span>
                <p className="text-slate-300 text-xs mt-1">
                  Each guide must contain exactly 4 to 20 numbered steps. Steps are written in clear, plain language accessible to everyone.
                </p>
              </div>
              <div className="p-4 rounded-2xl border border-white/5 bg-white/5">
                <span className="font-semibold text-white block">Video Embed Standards</span>
                <p className="text-slate-300 text-xs mt-1">
                  Legally sourced, high-quality embeds via YouTube / Vimeo APIs or self-hosted HLS streams.
                </p>
              </div>
            </div>
          </div>
          <div className="md:col-span-6 space-y-5">
            <div className="p-6 rounded-3xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-md">
              <h4 className="font-bold text-amber-400 text-lg">⚠️ Risk Mitigation: Limited Launch Content</h4>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                <strong>Mitigation:</strong> Pre-populate at least <strong>50 guides</strong> across all 6 launch categories before publication to secure immediate retention.
              </p>
            </div>
            <div className="p-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md">
              <h4 className="font-bold text-emerald-400 text-lg">💡 Video Fallback logic</h4>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                <strong>Mitigation:</strong> If a third-party video embed fails or is deleted, the app automatically fails over to display text-only guides without breaking the UI.
              </p>
            </div>
          </div>
        </div>
      )
    },
    // Slide 8: Internship Roadmap
    {
      id: 8,
      title: "Internship Roadmap",
      subtitle: "12-Week Feature Expansion & Delivery",
      icon: <TrendingUp className="h-6 w-6 text-indigo-400" />,
      content: (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 items-center h-full">
          <div className="md:col-span-12 space-y-4">
            <h3 className="text-xl font-bold text-white text-center sm:text-left">Milestones Aligned with Phase 2 & 3</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-3xl border border-blue-500/20 bg-blue-500/5 backdrop-blur-md space-y-3">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-[11px] font-bold text-blue-400 uppercase">
                  Weeks 1–4 · MVP Polish
                </div>
                <h4 className="text-lg font-bold text-white">Core Refinement</h4>
                <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                  <li>Deploy service worker & IndexedDB for F07 Offline Access</li>
                  <li>Reduce AI Gateway latency (Gemini response stream tuning)</li>
                  <li>Polish mobile app-shell UI transitions & responsiveness</li>
                </ul>
              </div>

              <div className="p-5 rounded-3xl border border-purple-500/20 bg-purple-500/5 backdrop-blur-md space-y-3">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3 py-1 text-[11px] font-bold text-purple-400 uppercase">
                  Weeks 5–8 · Community
                </div>
                <h4 className="text-lg font-bold text-white">Engagement & Loops</h4>
                <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                  <li>Implement F11 comments & user feedback loops</li>
                  <li>Build F12 Creator Profiles with handle-based sharing</li>
                  <li>Gamify progress: add milestones & custom achievement triggers</li>
                </ul>
              </div>

              <div className="p-5 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md space-y-3">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-400 uppercase">
                  Weeks 9–12 · Intelligence
                </div>
                <h4 className="text-lg font-bold text-white">Smart Features</h4>
                <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                  <li>Integrate F10 Voice Search using Web Speech API</li>
                  <li>Develop personalized guide recommendation models</li>
                  <li>PWA distribution setup & local notification prompts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    // Slide 9: Technical Architecture
    {
      id: 9,
      title: "Technical Architecture",
      subtitle: "DoGuide's Modern Technology Stack",
      icon: <Cpu className="h-6 w-6 text-cyan-400" />,
      content: (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 items-center h-full">
          <div className="md:col-span-12 space-y-4">
            <h3 className="text-xl font-bold text-white text-center sm:text-left">End-to-End Scalable Stack</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  layer: "Frontend & Router",
                  stack: "TanStack Start + Vite",
                  details: "File-based routing, server-side rendering (SSR), and seamless bundle code splitting.",
                  color: "border-pink-500/20 bg-pink-500/5 text-pink-400"
                },
                {
                  layer: "Styling & UI",
                  stack: "Tailwind CSS v4 + Radix",
                  details: "High performance build-time utility compiling with responsive, accessible primitives.",
                  color: "border-cyan-500/20 bg-cyan-500/5 text-cyan-400"
                },
                {
                  layer: "Database & Security",
                  stack: "Supabase + PostgreSQL",
                  details: "Real-time client connections, database triggers, Row Level Security (RLS) for user-owned data.",
                  color: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                },
                {
                  layer: "AI & Inference",
                  stack: "AI Gateway + Gemini",
                  details: "Streamlined integration with Gemini 3.5 Flash for quick-response generation and troubleshooter chatbots.",
                  color: "border-amber-500/20 bg-amber-500/5 text-amber-400"
                }
              ].map((tech, idx) => (
                <div key={idx} className={`p-5 rounded-3xl border ${tech.color.split(' ')[0]} ${tech.color.split(' ')[1]} backdrop-blur-md space-y-2`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{tech.layer}</span>
                  <h4 className={`text-base font-extrabold ${tech.color.split(' ')[2]}`}>{tech.stack}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{tech.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    // Slide 10: Thank You / Closing
    {
      id: 10,
      title: "Thank You",
      subtitle: "Join the DoGuide Journey",
      icon: <Sparkles className="h-6 w-6 text-amber-400 animate-pulse" />,
      content: (
        <div className="flex flex-col items-center justify-center text-center h-full space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-widest animate-pulse">
            ✨ Let's Build the Future of Learning
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl leading-none">
            Learn Anything.{" "}
            <span className="bg-gradient-to-r from-[#ff6f61] via-[#f59e0b] to-[#6366f1] bg-clip-text text-transparent">
              Do Anything.
            </span>
          </h2>
          <p className="text-slate-300 max-w-xl text-base md:text-lg leading-relaxed">
            DoGuide simplifies the friction of daily life, giving everyone the confidence 
            to execute practical skills with clarity, video guidance, and AI assistance.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 max-w-md w-full text-sm">
            <div className="p-4 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md">
              <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Get in Touch</span>
              <span className="text-white font-medium mt-1 block">hello@doguide.com</span>
            </div>
            <div className="p-4 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md">
              <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Explore Platform</span>
              <span className="text-[#ff6f61] hover:underline font-medium mt-1 block cursor-pointer">www.doguide.com</span>
            </div>
          </div>
          
          <div className="text-xs text-slate-500 pt-6">
            © 2026 DoGuide Inc. All rights reserved.
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft" || e.key === "Backspace") {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between z-10 backdrop-blur-md bg-[#020617]/50">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#ff6f61] to-[#6366f1] flex items-center justify-center font-bold text-white shadow-md text-lg">
            D
          </div>
          <div>
            <div className="font-extrabold tracking-tight text-white">DoGuide</div>
            <div className="text-[9px] uppercase tracking-widest text-[#ff6f61] font-semibold">Pitch Deck</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs text-slate-400 hidden sm:block">
            Use <kbd className="px-1.5 py-0.5 rounded border border-white/20 bg-white/5 text-[10px]">←</kbd> / <kbd className="px-1.5 py-0.5 rounded border border-white/20 bg-white/5 text-[10px]">→</kbd> or <kbd className="px-1.5 py-0.5 rounded border border-white/20 bg-white/5 text-[10px]">Space</kbd> to navigate
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white border border-white/10 bg-white/5 px-3 py-1.5 rounded-xl transition"
          >
            <Home className="h-3.5 w-3.5" /> Back to App
          </Link>
        </div>
      </header>

      {/* Slide Content Container */}
      <main className="flex-1 flex items-center justify-center p-6 md:p-12 z-10">
        <div className="w-full max-w-6xl min-h-[480px] bg-slate-900/50 border border-white/10 rounded-3xl p-6 md:p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden backdrop-blur-md">
          {/* Active slide title & indicator */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/5 text-slate-300">
                {slides[currentSlide].icon}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Slide {currentSlide + 1} of {slides.length}
                </span>
                <h2 className="text-lg font-bold text-white">{slides[currentSlide].subtitle || slides[currentSlide].title}</h2>
              </div>
            </div>
            <div className="text-xs font-bold text-slate-400 bg-white/5 px-3 py-1.5 rounded-full">
              {Math.round(((currentSlide + 1) / slides.length) * 100)}% Complete
            </div>
          </div>

          {/* Core Slide Content */}
          <div className="flex-1 py-4">
            {slides[currentSlide].content}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-6">
            <button
              onClick={handlePrev}
              disabled={currentSlide === 0}
              className="inline-flex items-center gap-1.5 text-sm font-semibold border border-white/10 bg-white/5 px-4 py-2.5 rounded-2xl hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5 transition text-slate-300 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    currentSlide === index ? "w-6 bg-[#ff6f61]" : "w-2.5 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={currentSlide === slides.length - 1}
              className="inline-flex items-center gap-1.5 text-sm font-semibold bg-gradient-to-r from-[#ff6f61] to-[#ff8c42] text-white px-5 py-2.5 rounded-2xl hover:opacity-90 disabled:opacity-40 disabled:hover:opacity-40 transition"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-4 text-center text-xs text-slate-500 z-10">
        DoGuide Pitch Deck — Proprietary & Confidential Document
      </footer>
    </div>
  );
}
