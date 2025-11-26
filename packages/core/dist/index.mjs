var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/validators/schemas.ts
import { z } from "zod";
var SOCIAL_MEDIAS = [
  "instagram_media",
  "youtube_video",
  "pin",
  "tweet",
  "article",
  "facebook_status",
  "twitch_stream",
  "tiktok_video",
  "story"
];
var PostTypeSchema = z.enum(SOCIAL_MEDIAS);
var PostSchema = z.object({
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

// src/aggregator/post-aggregator.ts
var PostAggregator = class {
  constructor() {
    __publicField(this, "accumulator");
    __publicField(this, "totals");
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
  constructor(url, options = {}) {
    __publicField(this, "eventSource", null);
    __publicField(this, "url");
    __publicField(this, "options");
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
        const data = JSON.parse(event.data);
        const keys = Object.keys(data);
        if (keys.length !== 1) return;
        const eventType = keys[0];
        const eventPayload = data[eventType];
        const parsedEventType = PostTypeSchema.safeParse(eventType);
        const parsedPayload = PostSchema.safeParse(eventPayload);
        if (parsedEventType.success && parsedPayload.success) {
          this.options.onMessage?.(
            parsedEventType.data,
            parsedPayload.data.timestamp
          );
        } else {
          console.warn("Invalid payload:", data);
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
  PostAggregator,
  PostSchema,
  PostTypeSchema,
  SOCIAL_MEDIAS,
  SSEClient,
  getDayOfWeek,
  getHourOfDay,
  refreshRateInMilliSeconds,
  streamUrl
};
