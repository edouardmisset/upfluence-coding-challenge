import { z } from 'zod';

declare const SOCIAL_MEDIAS: readonly ["instagram_media", "youtube_video", "pin", "tweet", "article", "facebook_status", "twitch_stream", "tiktok_video", "story"];
declare const PostTypeSchema: z.ZodEnum<["instagram_media", "youtube_video", "pin", "tweet", "article", "facebook_status", "twitch_stream", "tiktok_video", "story"]>;
type PostType = z.infer<typeof PostTypeSchema>;
declare const PostSchema: z.ZodObject<{
    /** Unix timestamp in seconds */
    timestamp: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    timestamp: number;
}, {
    timestamp: number;
}>;
type Post = z.infer<typeof PostSchema>;
type Timestamp = Post['timestamp'];

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
type Accumulator = Record<PostType, Record<WeekDay, Record<HourOfDay, number>>>;
type Totals = Record<PostType, number>;
declare class PostAggregator {
    private accumulator;
    private totals;
    constructor();
    increment(postType: PostType, timestamp: Timestamp): void;
    getData(): Accumulator;
    getTotal(postType: PostType): number;
    getAllTotals(): Totals;
}

declare const streamUrl = "https://stream.upfluence.co/stream";
declare const refreshRateInMilliSeconds = 1000;
type SSEOptions = {
    onMessage?: (type: PostType, timestamp: Timestamp) => void;
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

export { type Accumulator, type Post, PostAggregator, PostSchema, type PostType, PostTypeSchema, SOCIAL_MEDIAS, SSEClient, type SSEOptions, type Timestamp, type Totals, getDayOfWeek, getHourOfDay, refreshRateInMilliSeconds, streamUrl };
