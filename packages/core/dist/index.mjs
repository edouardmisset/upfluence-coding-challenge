// src/utils/time-utils.ts
function getDayOfWeek(timestamp) {
  return new Date(timestamp * 1e3).getUTCDay();
}
function getHourOfDay(timestamp) {
  return new Date(timestamp * 1e3).getUTCHours();
}

// src/accumulator/event-accumulator.ts
var createEventAccumulator = () => {
  const accumulator = {};
  const totals = {};
  const increment = (socialMediaType, timestamp) => {
    const day = getDayOfWeek(timestamp);
    const hour = getHourOfDay(timestamp);
    const socialMediaData = accumulator[socialMediaType] ??= {};
    const dayData = socialMediaData[day] ??= {};
    dayData[hour] = (dayData[hour] ?? 0) + 1;
    totals[socialMediaType] = (totals[socialMediaType] ?? 0) + 1;
  };
  const getData = () => accumulator;
  const getTotal = (socialMediaType) => totals[socialMediaType] ?? 0;
  const getAllTotals = () => {
    return Object.fromEntries(
      Object.entries(totals).toSorted(([, a], [, b]) => b - a)
    );
  };
  return {
    increment,
    getData,
    getTotal,
    getAllTotals
  };
};

// src/constants.ts
var SOCIAL_MEDIAS = [
  "tiktok_video",
  "instagram_media",
  "story",
  "twitch_stream",
  "youtube_video",
  "pin",
  "article",
  "tweet",
  "facebook_status"
];
var SOCIAL_MEDIA_TEXT_MAP = {
  tiktok_video: "TikTok",
  instagram_media: "Instagram",
  story: "Story",
  twitch_stream: "Twitch",
  youtube_video: "YouTube",
  pin: "Pinterest",
  article: "Article",
  tweet: "Twitter",
  facebook_status: "Facebook"
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
var STREAM_URL = "https://stream.upfluence.co/stream";
var REFRESH_RATE_MILLISECONDS = 1e3;

// ../../node_modules/.pnpm/@jsr+edouardmisset__function@5.0.0/node_modules/@jsr/edouardmisset__function/get-env.js
import process from "process";

// ../../node_modules/.pnpm/@jsr+edouardmisset__math@5.0.0/node_modules/@jsr/edouardmisset__math/round-to-precision.js
function roundToPrecision(decimalNumber, precision = 0) {
  return Math.round(decimalNumber * 10 ** precision) / 10 ** precision;
}

// src/utils/performance-tracker.ts
var createPerformanceTracker = () => {
  let lastTime = 0;
  let previousTotal = 0;
  let rate = 0;
  const reset = () => {
    lastTime = Date.now();
    previousTotal = 0;
    rate = 0;
  };
  const update = (currentTotal) => {
    const now = Date.now();
    const timeDifferenceInSeconds = (now - lastTime) / 1e3;
    if (timeDifferenceInSeconds > 0) {
      const countDiff = currentTotal - previousTotal;
      rate = roundToPrecision(countDiff / timeDifferenceInSeconds, 1);
    }
    previousTotal = currentTotal;
    lastTime = now;
  };
  const getRate = () => rate;
  reset();
  return {
    reset,
    update,
    getRate
  };
};

// src/validators/schemas.ts
import { z } from "zod";
var SocialMediasSchema = z.enum(SOCIAL_MEDIAS);
var ContentSchema = z.object({
  /** Unix timestamp in seconds */
  timestamp: z.number()
});

// src/stream/sse-client.ts
var createSSEClient = (url, options = {}) => {
  let eventSource = null;
  const connect = () => {
    if (eventSource) {
      eventSource.close();
    }
    eventSource = new EventSource(url);
    eventSource.onopen = (event) => {
      options.onOpen?.(event);
    };
    eventSource.onerror = (error) => {
      options.onError?.(error);
    };
    eventSource.onmessage = (event) => {
      try {
        const json = JSON.parse(event.data);
        const keys = Object.keys(json);
        if (keys.length !== 1) return;
        const socialMedia = keys[0];
        const content = json[socialMedia];
        const parsedSocialMedia = SocialMediasSchema.safeParse(socialMedia);
        const parsedContent = ContentSchema.safeParse(content);
        if (parsedSocialMedia.success && parsedContent.success) {
          options.onMessage?.(
            parsedSocialMedia.data,
            parsedContent.data.timestamp
          );
        } else {
          console.warn("Invalid payload:", json);
        }
      } catch (error) {
        console.error("Failed to parse SSE message", error);
      }
    };
  };
  const disconnect = () => {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
  };
  return { connect, disconnect };
};

// src/services/stream-service.ts
var createStreamService = (url) => {
  const accumulator = createEventAccumulator();
  const performanceTracker = createPerformanceTracker();
  const listeners = /* @__PURE__ */ new Set();
  let state = {
    isConnected: false,
    accumulator: accumulator.getData(),
    totals: accumulator.getAllTotals(),
    eventsPerSecond: 0,
    totalEvents: 0
  };
  let updateInterval = null;
  const notifyListeners = () => {
    for (const listener of listeners) {
      listener(state);
    }
  };
  const handleConnectionChange = (isConnected) => {
    state = { ...state, isConnected };
    notifyListeners();
  };
  const handleMessage = (type, timestamp) => {
    accumulator.increment(type, timestamp);
  };
  const updateState = () => {
    const totals = accumulator.getAllTotals();
    const totalEvents = Object.values(totals).reduce((a, b) => a + b, 0);
    performanceTracker.update(totalEvents);
    state = {
      ...state,
      accumulator: { ...accumulator.getData() },
      totals: { ...totals },
      eventsPerSecond: performanceTracker.getRate(),
      totalEvents
    };
    notifyListeners();
  };
  const startUpdateLoop = () => {
    if (updateInterval) return;
    updateInterval = setInterval(() => {
      updateState();
    }, REFRESH_RATE_MILLISECONDS);
  };
  const stopUpdateLoop = () => {
    if (updateInterval) {
      clearInterval(updateInterval);
      updateInterval = null;
    }
  };
  const client = createSSEClient(url, {
    onOpen: () => handleConnectionChange(true),
    onError: () => handleConnectionChange(false),
    onMessage: handleMessage
  });
  const connect = () => {
    client.connect();
    startUpdateLoop();
  };
  const disconnect = () => {
    client.disconnect();
    stopUpdateLoop();
    handleConnectionChange(false);
  };
  const subscribe = (listener) => {
    listeners.add(listener);
    listener(state);
    return () => {
      listeners.delete(listener);
    };
  };
  return {
    connect,
    disconnect,
    subscribe
  };
};

// src/utils/calculate-intensity.ts
function calculateIntensity({
  count,
  maxCount
}) {
  const numberOfBuckets = 5;
  return 0 < count ? Math.ceil(count / maxCount * numberOfBuckets) : 0;
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
  HOURS,
  REFRESH_RATE_MILLISECONDS,
  SOCIAL_MEDIAS,
  SOCIAL_MEDIA_TEXT_MAP,
  STREAM_URL,
  SocialMediasSchema,
  calculateIntensity,
  calculateMaxHourlyCount,
  createEventAccumulator,
  createPerformanceTracker,
  createSSEClient,
  createStreamService,
  getDayOfWeek,
  getHourOfDay
};
