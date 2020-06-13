import { CacheControl } from "./types";

export const cacheControlParser = (
  cacheControlHeader: string
): CacheControl => {
  const cacheControl: CacheControl = {};

  const directives = cacheControlHeader.split(",").map(str =>
    str
      .trim()
      .split("=")
      .map(str => str.trim())
  );

  for (const [directive, value] of directives) {
    switch (directive) {
      case "max-age":
        const maxAge = parseInt(value, 10);

        if (isNaN(maxAge)) continue;

        cacheControl.maxAge = maxAge;

        break;
      case "s-maxage":
        const sharedMaxAge = parseInt(value, 10);

        if (isNaN(sharedMaxAge)) continue;

        cacheControl.sharedMaxAge = sharedMaxAge;
        break;
      case "stale-while-revalidate":
        const staleWhileRevalidate = parseInt(value, 10);

        if (isNaN(staleWhileRevalidate)) continue;

        cacheControl.staleWhileRevalidate = staleWhileRevalidate;
        break;
      case "stale-if-error":
        const staleIfError = parseInt(value, 10);

        if (isNaN(staleIfError)) continue;

        cacheControl.staleIfError = staleIfError;
        break;
      case "public":
        cacheControl.isPublic = true;
        break;
      case "private":
        cacheControl.isPrivate = true;
        break;
      case "no-store":
        cacheControl.noStore = true;
        break;
      case "no-cache":
        cacheControl.noCache = true;
        break;
      case "must-revalidate":
        cacheControl.mustRevalidate = true;
        break;
      case "proxy-revalidate":
        cacheControl.proxyRevalidate = true;
        break;
      case "immutable":
        cacheControl.immutable = true;
        break;
      case "no-transform":
        cacheControl.noTransform = true;
        break;
    }
  }

  return cacheControl;
};
