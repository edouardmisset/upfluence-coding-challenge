// src/validators/schemas.ts
import { z } from "zod";
var SOCIAL_MEDIAS = [
  "instagram_media",
  "youtube_video",
  "pin",
  "tweet",
  "article",
  "facebook_status"
];
var PostTypeSchema = z.enum(SOCIAL_MEDIAS);
var PostSchema = z.object({
  timestamp: z.number()
  // Unix timestamp in seconds
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
  data;
  totals;
  constructor() {
    this.data = {};
    this.totals = {};
  }
  increment(postType, timestamp) {
    const day = getDayOfWeek(timestamp);
    const hour = getHourOfDay(timestamp);
    if (!this.data[postType]) {
      this.data[postType] = {};
      this.totals[postType] = 0;
    }
    if (!this.data[postType][day]) {
      this.data[postType][day] = {};
    }
    if (!this.data[postType][day][hour]) {
      this.data[postType][day][hour] = 0;
    }
    this.data[postType][day][hour]++;
    this.totals[postType]++;
  }
  getData() {
    return this.data;
  }
  getTotal(postType) {
    return this.totals[postType] || 0;
  }
  getAllTotals() {
    return this.totals;
  }
};

// src/stream/sse-client.ts
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
  getHourOfDay
};
