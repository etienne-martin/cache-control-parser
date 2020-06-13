export interface CacheControl {
  maxAge?: number;
  sharedMaxAge?: number;
  staleWhileRevalidate?: number;
  staleIfError?: number;
  isPublic?: boolean;
  isPrivate?: boolean;
  noStore?: boolean;
  noCache?: boolean;
  mustRevalidate?: boolean;
  proxyRevalidate?: boolean;
  immutable?: boolean;
  noTransform?: boolean;
}
