# DoGuide v2.0 — Full Rebuild Plan

Scrapping the existing UI shell and rebuilding around the PRD's information architecture (Home / Search / Guide / Profile) on top of Lovable Cloud + Lovable AI Gateway. Existing auth wiring (Supabase profiles, AuthModal, useAuth) is reused under the hood; everything visible is rebuilt.

## Information Architecture

```
/                  Home — Smart Feed (recommendations, trending, categories, challenges)
/search            Search — semantic search + filters + voice (later)
/guide/$id         Guide View — steps, video, AI help, comments, save, mode switch
/category/$slug    Category browse
/path/$slug        Learning Path detail
/profile           Profile — achievements, skill levels, saved, progress
/creator/$handle   Creator profile (Phase 2)
/auth              Sign in / Sign up page (modal still available)
```

Shared shell: top app bar (logo, global search, profile avatar) + bottom tab bar on mobile (Home / Search / Saved / Profile).

## Phased Delivery

### Phase 1 — MVP (this rebuild)
Covers F01–F09 plus the visual/IA overhaul.

1. **Design system reset** — refreshed tokens in `src/styles.css` (warm "learn-by-doing" palette, type scale, card/elev styles), reusable `AppShell`, `TopBar`, `BottomNav`, `SectionHeader`.
2. **Home / Smart Feed** (F01) — hero search, continue-learning row (auth users), trending guides, category grid, daily challenge card, learning paths teaser.
3. **Global Smart Search** (F02) — `/search?q=` route with semantic re-ranking via AI Gateway over a guide index (seeded + user-saved + generated). Filters: category, difficulty, time, mode.
4. **Step-by-Step Guides** (F03) — `/guide/$id` route. Guides are persisted (`guides` table) so they're shareable, savable, completable.
5. **Video Integration** (F04) — YouTube embed using existing `video_query`, plus inline thumbnails per step when available.
6. **Guide Modes** (F05) — Quick + Step-by-step (first cut). Mode toggle re-renders the same guide data; Quick = TL;DR + 3-bullet steps, Step = full detail.
7. **Progress Tracking** (F06) — per-step checkboxes; `guide_progress` table stores completion %, last step, completed_at.
8. **Offline Access** (F07) — service worker + IndexedDB cache of saved guides; "Available offline" badge.
9. **AI Troubleshooter** (F08) — in-guide chat panel ("I'm stuck") powered by AI Gateway; context = current guide + step.
10. **QuickFix Mode** (F09) — top-bar quick-ask that returns a 30-second answer card without generating a full guide.

### Phase 2 — Community + Gamification
Voice search (F10), comments (F11), creator profiles (F12), XP/achievements/skill levels, learning paths authoring, reputation.

### Phase 3 — Intelligent platform
Personalized recommendations (collaborative + embedding-based), adaptive paths, certifications, creator monetization.

### Phase 4 — Ecosystem
Web/PWA polish, enterprise, AR, live classes.

## Data Model (Phase 1)

```
profiles            (exists) — display_name, avatar_url, bio, skill_levels jsonb
guides              id, slug, title, summary, category, difficulty, time_minutes,
                    materials jsonb, steps jsonb, tips jsonb, video_query,
                    author_id (nullable for AI), is_published, created_at
guide_progress      user_id, guide_id, step_index, completed_steps jsonb,
                    completed_at, updated_at  (RLS: own rows only)
saved_guides        user_id, guide_id, saved_at                      (RLS: own)
challenges          id, title, description, category, active_on date
learning_paths      id, slug, title, description, category, guide_ids jsonb
```

All tables get explicit GRANTs + RLS policies (own-row for user data, public read for `guides`/`challenges`/`learning_paths`).

## Technical Notes

- **AI**: Lovable AI Gateway (`google/gemini-2.5-flash`) for guide generation, semantic search re-ranking, troubleshooter chat, QuickFix.
- **Server functions**: `generateGuide`, `searchGuides`, `troubleshoot`, `quickFix`, `recordProgress`, `toggleSave` — all `createServerFn` under `src/lib/*.functions.ts`. Auth-required ones use `requireSupabaseAuth`.
- **Offline**: Workbox-style SW registered in `__root.tsx`; IndexedDB via `idb-keyval` for guide bodies.
- **State**: TanStack Query everywhere (loaders use `ensureQueryData`, components use `useSuspenseQuery`).
- **Routing**: file-based per TanStack rules; layout route for authenticated areas where needed.

## What gets removed
Current home, guide, saved, and BackgroundControls files are replaced. AuthModal, useAuth, profiles migration are kept. Categories list is kept but reduced to the 8 PRD categories (Food, DIY, Sports & Fitness, Music, Technology, Health & Wellness, Creative Arts, Travel & Lifestyle).

## Out of scope for this first build
Voice search, comments, creator uploads, gamification, learning-path authoring, certifications, monetization, AR — all deferred to Phase 2+.
