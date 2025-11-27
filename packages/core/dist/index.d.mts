import { z } from 'zod';

declare const SOCIAL_MEDIAS: readonly ["instagram_media", "youtube_video", "pin", "tweet", "article", "facebook_status", "twitch_stream", "tiktok_video", "story"];
declare const SocialMediasSchema: z.ZodEnum<["instagram_media", "youtube_video", "pin", "tweet", "article", "facebook_status", "twitch_stream", "tiktok_video", "story"]>;
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

/** [0 - 6] */
type WeekDay = number;
/** [0 - 23] */
type HourOfDay = number;
type Accumulator = Record<SocialMedias, Record<WeekDay, Record<HourOfDay, number>>>;
type Totals = Record<SocialMedias, number>;
declare class PostAggregator {
    private accumulator;
    private totals;
    constructor();
    increment(postType: SocialMedias, timestamp: Timestamp): void;
    getData(): Accumulator;
    getTotal(postType: SocialMedias): number;
    getAllTotals(): Totals;
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

export { type Accumulator, type Content, ContentSchema, PostAggregator, SOCIAL_MEDIAS, SSEClient, type SSEOptions, type SocialMedias, SocialMediasSchema, type Timestamp, type Totals, getDayOfWeek, getHourOfDay, refreshRateInMilliSeconds, streamUrl };
