// src/utils/time-utils.ts
function getDayOfWeek(timestamp) {
  return new Date(timestamp * 1e3).getUTCDay();
}
function getHourOfDay(timestamp) {
  return new Date(timestamp * 1e3).getUTCHours();
}

// src/accumulator/event-accumulator.ts
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

// src/constants.ts
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
var SOCIAL_MEDIA_TEXT_MAP = {
  pin: "Pinterest",
  instagram_media: "Instagram",
  youtube_video: "YouTube",
  article: "Article",
  tweet: "Tweeter",
  facebook_status: "Facebook",
  twitch_stream: "Twitch",
  tiktok_video: "TikTok",
  story: "Story"
};
var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var HOURS = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23
];

// src/validators/schemas.ts
import { z } from "zod";
var SocialMediasSchema = z.enum(SOCIAL_MEDIAS);
var ContentSchema = z.object({
  /** Unix timestamp in seconds */
  timestamp: z.number()
});

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

// ../../node_modules/.pnpm/@jsr+edouardmisset__function@5.0.0/node_modules/@jsr/edouardmisset__function/get-env.js
import process from "process";

// ../../node_modules/.pnpm/@jsr+edouardmisset__math@5.0.0/node_modules/@jsr/edouardmisset__math/round-to-precision.js
function roundToPrecision(decimalNumber, precision = 0) {
  return Math.round(decimalNumber * 10 ** precision) / 10 ** precision;
}

// src/utils/performance-tracker.ts
var PerformanceTracker = class {
  lastTime = 0;
  previousTotal = 0;
  rate = 0;
  constructor() {
    this.reset();
  }
  reset() {
    this.lastTime = Date.now();
    this.previousTotal = 0;
    this.rate = 0;
  }
  update(currentTotal) {
    const now = Date.now();
    const timeDifferenceInSeconds = (now - this.lastTime) / 1e3;
    if (timeDifferenceInSeconds > 0) {
      const countDiff = currentTotal - this.previousTotal;
      this.rate = roundToPrecision(countDiff / timeDifferenceInSeconds, 1);
    }
    this.previousTotal = currentTotal;
    this.lastTime = now;
  }
  getRate() {
    return this.rate;
  }
};

// src/services/stream-service.ts
var StreamService = class {
  client;
  accumulator;
  performanceTracker;
  listeners = /* @__PURE__ */ new Set();
  state;
  updateInterval = null;
  constructor(url) {
    this.accumulator = new EventAccumulator();
    this.performanceTracker = new PerformanceTracker();
    this.state = {
      isConnected: false,
      accumulator: this.accumulator.getData(),
      totals: this.accumulator.getAllTotals(),
      eventsPerSecond: 0,
      totalEvents: 0
    };
    this.client = new SSEClient(url, {
      onOpen: () => this.handleConnectionChange(true),
      onError: () => this.handleConnectionChange(false),
      onMessage: (type, timestamp) => this.handleMessage(type, timestamp)
    });
  }
  connect() {
    this.client.connect();
    this.startUpdateLoop();
  }
  disconnect() {
    this.client.disconnect();
    this.stopUpdateLoop();
    this.handleConnectionChange(false);
  }
  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }
  handleConnectionChange(isConnected) {
    this.state = { ...this.state, isConnected };
    this.notifyListeners();
  }
  handleMessage(type, timestamp) {
    this.accumulator.increment(type, timestamp);
  }
  startUpdateLoop() {
    if (this.updateInterval) return;
    this.updateInterval = setInterval(() => {
      this.updateState();
    }, refreshRateInMilliSeconds);
  }
  stopUpdateLoop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
  updateState() {
    const totals = this.accumulator.getAllTotals();
    const totalEvents = Object.values(totals).reduce((a, b) => a + b, 0);
    this.performanceTracker.update(totalEvents);
    this.state = {
      ...this.state,
      accumulator: { ...this.accumulator.getData() },
      totals: { ...totals },
      eventsPerSecond: this.performanceTracker.getRate(),
      totalEvents
    };
    this.notifyListeners();
  }
  notifyListeners() {
    this.listeners.forEach((listener) => listener(this.state));
  }
};

// src/utils/calculate-intensity.ts
function calculateIntensity({
  count,
  maxCount
}) {
  return 0 < count ? Math.ceil(count / maxCount * 5) : 0;
}

// src/utils/calculate-max-hourly-count.ts
function calculateMaxHourlyCount(weekdayHourlyCount) {
  return Math.max(
    0,
    ...Object.values(weekdayHourlyCount).flatMap((day) => Object.values(day))
  ) || 1;
}
export {
  ContentSchema,
  DAYS,
  EventAccumulator,
  HOURS,
  PerformanceTracker,
  SOCIAL_MEDIAS,
  SOCIAL_MEDIA_TEXT_MAP,
  SSEClient,
  SocialMediasSchema,
  StreamService,
  calculateIntensity,
  calculateMaxHourlyCount,
  getDayOfWeek,
  getHourOfDay,
  refreshRateInMilliSeconds,
  streamUrl
};
