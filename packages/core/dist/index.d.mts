import { z } from 'zod';

declare const SocialMediasSchema: z.ZodEnum<["tiktok_video", "instagram_media", "story", "youtube_video", "pin", "tweet", "article", "facebook_status", "twitch_stream"]>;
type SocialMedias = z.infer<typeof SocialMediasSchema>;
declare const ContentSchema: z.ZodObject<{
    /** Unix timestamp in seconds */
    timestamp: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    timestamp: number;
}, {
    timestamp: number;
}>;
type Content = z.infer<typeof ContentSchema>;
type Timestamp = Content['timestamp'];

/** Days of the week: [0 - 6] */
type WeekDay = number;
/** 24 hours: [0 - 23] */
type HourOfDay = number;
/** Mapping of day to hour to count, e.g., { 2: { 16: 3 } } */
type WeekdayHourlyCount = Record<WeekDay, Record<HourOfDay, number>>;
type Accumulator = Record<SocialMedias, WeekdayHourlyCount>;
type Totals = Record<SocialMedias, number>;
declare class EventAccumulator {
    private accumulator;
    private totals;
    constructor();
    increment(postType: SocialMedias, timestamp: Timestamp): void;
    getData(): Accumulator;
    getTotal(postType: SocialMedias): number;
    getAllTotals(): Totals;
}

declare const SOCIAL_MEDIAS: readonly ["tiktok_video", "instagram_media", "story", "youtube_video", "pin", "tweet", "article", "facebook_status", "twitch_stream"];
declare const SOCIAL_MEDIA_TEXT_MAP: {
    readonly pin: "Pinterest";
    readonly instagram_media: "Instagram";
    readonly youtube_video: "YouTube";
    readonly article: "Article";
    readonly tweet: "Tweeter";
    readonly facebook_status: "Facebook";
    readonly twitch_stream: "Twitch";
    readonly tiktok_video: "TikTok";
    readonly story: "Story";
};
declare const DAYS: readonly ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
declare const HOURS: readonly [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

type StreamState = {
    isConnected: boolean;
    accumulator: Accumulator;
    totals: Totals;
    eventsPerSecond: number;
    totalEvents: number;
};
type StreamServiceListener = (state: StreamState) => void;
declare class StreamService {
    private client;
    private accumulator;
    private performanceTracker;
    private listeners;
    private state;
    private updateInterval;
    constructor(url: string);
    connect(): void;
    disconnect(): void;
    subscribe(listener: StreamServiceListener): () => void;
    private handleConnectionChange;
    private handleMessage;
    private startUpdateLoop;
    private stopUpdateLoop;
    private updateState;
    private notifyListeners;
}

declare const streamUrl = "https://stream.upfluence.co/stream";
declare const refreshRateInMilliSeconds = 1000;
type SSEOptions = {
    onMessage?: (type: SocialMedias, timestamp: Timestamp) => void;
    onError?: (error: Event) => void;
    onOpen?: (event: Event) => void;
};
declare class SSEClient {
    private eventSource;
    private url;
    private options;
    constructor(url: string, options?: SSEOptions);
    connect(): void;
    disconnect(): void;
}

/**
 * Calculate the intensity level for a punch card cell based on the count and
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

declare class PerformanceTracker {
    private lastTime;
    private previousTotal;
    private rate;
    constructor();
    reset(): void;
    update(currentTotal: number): void;
    getRate(): number;
}

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

export { type Accumulator, type Content, ContentSchema, DAYS, EventAccumulator, HOURS, PerformanceTracker, SOCIAL_MEDIAS, SOCIAL_MEDIA_TEXT_MAP, SSEClient, type SSEOptions, type SocialMedias, SocialMediasSchema, StreamService, type StreamServiceListener, type StreamState, type Timestamp, type Totals, type WeekdayHourlyCount, calculateIntensity, calculateMaxHourlyCount, getDayOfWeek, getHourOfDay, refreshRateInMilliSeconds, streamUrl };
