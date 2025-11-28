// src/validators/schemas.ts
import { z } from "zod";
var SOCIAL_MEDIAS = [
  "tiktok_video",
  "instagram_media",
  "story",
  "youtube_video",
  "pin",
  "tweet",
  "article",
  "facebook_status",
  "twitch_stream"
];
var SocialMediasSchema = z.enum(SOCIAL_MEDIAS);
var ContentSchema = z.object({
  /** Unix timestamp in seconds */
  timestamp: z.number()
});

// src/utils/time-utils.ts
function getDayOfWeek(timestamp) {
  return new Date(timestamp * 1e3).getUTCDay();
}
function getHourOfDay(timestamp) {
  return new Date(timestamp * 1e3).getUTCHours();
}

// src/accumulator/post-accumulator.ts
var EventAccumulator = class {
  accumulator;
  totals;
  constructor() {
    this.accumulator = {};
    this.totals = {};
  }
  increment(postType, timestamp) {
    const day = getDayOfWeek(timestamp);
    const hour = getHourOfDay(timestamp);
    if (!this.accumulator[postType]) {
      this.accumulator[postType] = {};
      this.totals[postType] = 0;
    }
    if (!this.accumulator[postType][day]) {
      this.accumulator[postType][day] = {};
    }
    if (!this.accumulator[postType][day][hour]) {
      this.accumulator[postType][day][hour] = 0;
    }
    this.accumulator[postType][day][hour]++;
    this.totals[postType]++;
  }
  getData() {
    return this.accumulator;
  }
  getTotal(postType) {
    return this.totals[postType] || 0;
  }
  getAllTotals() {
    return this.totals;
  }
};

// src/stream/sse-client.ts
var streamUrl = "https://stream.upfluence.co/stream";
var refreshRateInMilliSeconds = 1e3;
var SSEClient = class {
  eventSource = null;
  url;
  options;
  constructor(url, options = {}) {
    this.url = url;
    this.options = options;
  }
  connect() {
    if (this.eventSource) {
      this.eventSource.close();
    }
    this.eventSource = new EventSource(this.url);
    this.eventSource.onopen = (event) => {
      this.options.onOpen?.(event);
    };
    this.eventSource.onerror = (error) => {
      this.options.onError?.(error);
    };
    this.eventSource.onmessage = (event) => {
      try {
        const json = JSON.parse(event.data);
        const keys = Object.keys(json);
        if (keys.length !== 1) return;
        const socialMedia = keys[0];
        const content = json[socialMedia];
        const parsedSocialMedia = SocialMediasSchema.safeParse(socialMedia);
        const parsedContent = ContentSchema.safeParse(content);
        if (parsedSocialMedia.success && parsedContent.success) {
          this.options.onMessage?.(
            parsedSocialMedia.data,
            parsedContent.data.timestamp
          );
        } else {
          console.warn("Invalid payload:", json);
        }
      } catch (e) {
        console.error("Failed to parse SSE message", e);
      }
    };
  }
  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
};
export {
  ContentSchema,
  EventAccumulator,
  SOCIAL_MEDIAS,
  SSEClient,
  SocialMediasSchema,
  getDayOfWeek,
  getHourOfDay,
  refreshRateInMilliSeconds,
  streamUrl
};
