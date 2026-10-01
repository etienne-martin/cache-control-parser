export interface CacheControl {
  "max-age"?: number;
  "max-stale"?: number | boolean;
  "min-fresh"?: number;
  "s-maxage"?: number;
  "stale-while-revalidate"?: number;
  "stale-if-error"?: number;
  public?: boolean;
  private?: boolean;
  "no-store"?: boolean;
  "no-cache"?: boolean;
  "must-revalidate"?: boolean;
  "must-understand"?: boolean;
  "only-if-cached"?: boolean;
  "proxy-revalidate"?: boolean;
  immutable?: boolean;
  "no-transform"?: boolean;
}
