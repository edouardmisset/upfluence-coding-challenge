import { z } from 'zod';

declare const SocialMediasSchema: z.ZodEnum<{
    tiktok_video: "tiktok_video";
    instagram_media: "instagram_media";
    story: "story";
    twitch_stream: "twitch_stream";
    youtube_video: "youtube_video";
    pin: "pin";
    article: "article";
    tweet: "tweet";
    facebook_status: "facebook_status";
}>;
type SocialMedias = z.infer<typeof SocialMediasSchema>;
declare const ContentSchema: z.ZodObject<{
    timestamp: z.ZodNumber;
}, z.core.$strip>;
type Content = z.infer<typeof ContentSchema>;
/** Unix timestamp in seconds */
type Timestamp = Content['timestamp'];

/** Days of the week: [0 - 6] */
type WeekDay = number;
/** 24 hours: [0 - 23] */
type HourOfDay = number;
/** Mapping of day to hour to count, e.g., { 2: { 16: 3 } } */
type WeekdayHourlyCount = Record<WeekDay, Record<HourOfDay, number>>;
type Accumulator = Record<SocialMedias, WeekdayHourlyCount>;
type Totals = Record<SocialMedias, number>;
declare const createEventAccumulator: () => {
    increment: (socialMediaType: SocialMedias, timestamp: Timestamp) => void;
    getData: () => Accumulator;
    getTotal: (socialMediaType: SocialMedias) => number;
    getAllTotals: () => Totals;
};

declare const SOCIAL_MEDIAS: readonly ["tiktok_video", "instagram_media", "story", "twitch_stream", "youtube_video", "pin", "article", "tweet", "facebook_status"];
declare const SOCIAL_MEDIA_TEXT_MAP: {
    readonly tiktok_video: "TikTok";
    readonly instagram_media: "Instagram";
    readonly story: "Story";
    readonly twitch_stream: "Twitch";
    readonly youtube_video: "YouTube";
    readonly pin: "Pinterest";
    readonly article: "Article";
    readonly tweet: "Twitter";
    readonly facebook_status: "Facebook";
};
declare const DAYS: readonly ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
declare const HOURS: readonly [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
declare const STREAM_URL = "https://stream.upfluence.co/stream";
declare const REFRESH_RATE_MILLISECONDS = 1000;

type StreamState = {
    isConnected: boolean;
    accumulator: Accumulator;
    totals: Totals;
    eventsPerSecond: number;
    totalEvents: number;
};
type StreamServiceListener = (state: StreamState) => void;
declare const createStreamService: (url: string) => {
    connect: () => void;
    disconnect: () => void;
    subscribe: (listener: StreamServiceListener) => (() => void);
};
type StreamService = ReturnType<typeof createStreamService>;

type SSEOptions = {
    onMessage?: (type: SocialMedias, timestamp: Timestamp) => void;
    onError?: (error: Event) => void;
    onOpen?: (event: Event) => void;
};
declare const createSSEClient: (url: string, options?: SSEOptions) => {
    connect: () => void;
    disconnect: () => void;
};

/**
 * Calculate the intensity level for a weekly calendar graph cell based on the count and
 * the maximum count.
 *
 * @param {number} count - The number of events for the given hour and day.
 * @param {number} maxCount - The maximum number of events across all hours and
 * days.
 * @returns {number} The intensity level (0-5), where 0 means no events and 5 is
 * the highest intensity.
 */
declare function calculateIntensity({ count, maxCount, }: {
    count: number;
    maxCount: number;
}): number;

/**
 * Calculates the maximum hourly count from a WeekdayHourlyCount object.
 * Note: If all counts are falsy (0 or empty), it returns 1.
 *
 * @param {WeekdayHourlyCount} weekdayHourlyCount - An object mapping weekdays
 * to hourly counts.
 * @returns {number} The maximum count found in any hour of any day, or 1 if all
 * values are falsy.
 */
declare function calculateMaxHourlyCount(weekdayHourlyCount: WeekdayHourlyCount): number;

declare const createPerformanceTracker: () => {
    reset: () => void;
    update: (currentTotal: number) => void;
    getRate: () => number;
};

/**
 * Returns the UTC day of the week for a given timestamp.
 *
 * NOTE: 0 = Sunday, 1 = Monday, ...
 *
 * @param timestamp - The timestamp in seconds.
 * @returns The day of the week (0 = Sunday, 1 = Monday, ...).
 */
declare function getDayOfWeek(timestamp: Timestamp): number;
/**
 * Returns the UTC hour of the day for a given timestamp.
 * @param timestamp - The timestamp in seconds.
 * @returns The hour of the day (0-23).
 */
declare function getHourOfDay(timestamp: Timestamp): number;

export { type Accumulator, type Content, ContentSchema, DAYS, HOURS, REFRESH_RATE_MILLISECONDS, SOCIAL_MEDIAS, SOCIAL_MEDIA_TEXT_MAP, type SSEOptions, STREAM_URL, type SocialMedias, SocialMediasSchema, type StreamService, type StreamServiceListener, type StreamState, type Timestamp, type Totals, type WeekdayHourlyCount, calculateIntensity, calculateMaxHourlyCount, createEventAccumulator, createPerformanceTracker, createSSEClient, createStreamService, getDayOfWeek, getHourOfDay };
