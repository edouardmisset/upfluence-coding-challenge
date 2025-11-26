import { z } from 'zod';

declare const SOCIAL_MEDIAS: readonly ["instagram_media", "youtube_video", "pin", "tweet", "article", "facebook_status"];
declare const PostTypeSchema: z.ZodEnum<["instagram_media", "youtube_video", "pin", "tweet", "article", "facebook_status"]>;
type PostType = z.infer<typeof PostTypeSchema>;
declare const PostSchema: z.ZodObject<{
    timestamp: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    timestamp: number;
}, {
    timestamp: number;
}>;
type Post = z.infer<typeof PostSchema>;

/**
 * Returns the UTC day of the week for a given timestamp.
 *
 * NOTE: 0 = Sunday, 1 = Monday, ...
 *
 * @param timestamp - The timestamp in seconds.
 * @returns The day of the week (0 = Sunday, 1 = Monday, ...).
 */
declare function getDayOfWeek(timestamp: number): number;
/**
 * Returns the UTC hour of the day for a given timestamp.
 * @param timestamp - The timestamp in seconds.
 * @returns The hour of the day (0-23).
 */
declare function getHourOfDay(timestamp: number): number;

type AggregatedData = Record<string, Record<number, Record<number, number>>>;
declare class PostAggregator {
    private data;
    private totals;
    constructor();
    increment(postType: PostType, timestamp: number): void;
    getData(): AggregatedData;
    getTotal(postType: PostType): number;
    getAllTotals(): Record<string, number>;
}

type SSEOptions = {
    onMessage?: (type: PostType, timestamp: number) => void;
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

export { type AggregatedData, type Post, PostAggregator, PostSchema, type PostType, PostTypeSchema, SOCIAL_MEDIAS, SSEClient, type SSEOptions, getDayOfWeek, getHourOfDay };
