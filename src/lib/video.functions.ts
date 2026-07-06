import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export interface YouTubeVideoResult {
  videoId: string;
  title: string;
  channel: string;
  duration: string;
}

// Scrape YouTube search page to retrieve high quality videos without API key
export async function fetchYoutubeSearch(query: string): Promise<YouTubeVideoResult[]> {
  try {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
      }
    });
    if (!res.ok) {
      throw new Error(`YouTube HTTP error: ${res.statusText}`);
    }
    const html = await res.text();
    
    // Parse ytInitialData JSON structure
    const match = html.match(/var ytInitialData\s*=\s*({.+?});/);
    if (!match) {
      // Fallback: Regex extraction of watch link video IDs
      const videoIds = [...html.matchAll(/\/watch\?v=([a-zA-Z0-9_-]{11})/g)].map(m => m[1]);
      const uniqueIds = Array.from(new Set(videoIds));
      return uniqueIds.slice(0, 5).map(id => ({
        videoId: id,
        title: "YouTube Tutorial Reference",
        channel: "YouTube Reference",
        duration: "Unknown",
      }));
    }
    
    const data = JSON.parse(match[1]);
    const contents = data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents ?? [];
    
    const results: YouTubeVideoResult[] = [];
    for (const item of contents) {
      if (item.videoRenderer) {
        const vr = item.videoRenderer;
        const videoId = vr.videoId;
        const title = vr.title?.runs?.[0]?.text || "Unknown Title";
        const channel = vr.ownerText?.runs?.[0]?.text || "Unknown Channel";
        const duration = vr.lengthText?.simpleText || "Unknown Duration";
        
        if (videoId && typeof videoId === 'string' && videoId.length === 11) {
          results.push({ videoId, title, channel, duration });
        }
      }
    }
    
    if (results.length > 0) {
      return results;
    }
    
    // Regex fallback if JSON parsing yields no results
    const videoIds = [...html.matchAll(/\/watch\?v=([a-zA-Z0-9_-]{11})/g)].map(m => m[1]);
    const uniqueIds = Array.from(new Set(videoIds));
    return uniqueIds.slice(0, 5).map(id => ({
      videoId: id,
      title: "YouTube Tutorial Reference",
      channel: "YouTube Reference",
      duration: "Unknown",
    }));
  } catch (err) {
    console.error("YouTube search fetch/parse error:", err);
    return [];
  }
}

// Server functions exposed to client-side code
export const searchYoutubeVideos = createServerFn({ method: "POST" })
  .inputValidator(z.object({ query: z.string().min(1) }))
  .handler(async ({ data: { query } }) => {
    return await fetchYoutubeSearch(query);
  });

export const resolveGuideVideo = createServerFn({ method: "POST" })
  .inputValidator(z.object({ guideId: z.string().uuid(), query: z.string().min(1) }))
  .handler(async ({ data: { guideId, query } }) => {
    const results = await fetchYoutubeSearch(query);
    if (results.length === 0) {
      return null;
    }
    const firstVideo = results[0];
    
    // Save the resolved video_id to the database guides table
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("guides")
      .update({ video_id: firstVideo.videoId })
      .eq("id", guideId);
      
    if (error) {
      console.error("Failed to update guide with resolved video ID:", error.message);
    }
    
    return firstVideo;
  });

export const updateGuideVideoId = createServerFn({ method: "POST" })
  .inputValidator(z.object({ guideId: z.string().uuid(), videoId: z.string().min(11).max(11) }))
  .handler(async ({ data: { guideId, videoId } }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("guides")
      .update({ video_id: videoId })
      .eq("id", guideId);
      
    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }
    return { success: true };
  });
