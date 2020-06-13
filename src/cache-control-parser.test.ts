import cacheControlParser from "./";
import compiledCacheControlParser from "../dist";

const testSuite = (
  parser: typeof cacheControlParser | typeof compiledCacheControlParser
) => {
  test("should parse empty cache-control header", () => {
    expect(parser("")).toEqual({});
  });

  test("should parse both boolean and numeric directives", () => {
    expect(
      parser(
        "max-age=1, s-maxage=2, stale-while-revalidate=3, stale-if-error=4, public, private, no-store, no-cache, must-revalidate, proxy-revalidate, immutable, no-transform"
      )
    ).toEqual({
      maxAge: 1,
      sharedMaxAge: 2,
      staleWhileRevalidate: 3,
      staleIfError: 4,
      isPublic: true,
      isPrivate: true,
      noStore: true,
      noCache: true,
      mustRevalidate: true,
      proxyRevalidate: true,
      immutable: true,
      noTransform: true
    });
  });

  test("should trim directives", () => {
    expect(
      parser("   max-age =  60 ,    s-maxage  = 3600 , public   ")
    ).toEqual({
      maxAge: 60,
      sharedMaxAge: 3600,
      isPublic: true
    });
  });

  test("should support directives that are not separated by spaces", () => {
    expect(parser("max-age=60,public")).toEqual({
      maxAge: 60,
      isPublic: true
    });
  });

  test("should override previously declared directives", () => {
    expect(parser("max-age=1, max-age=2")).toEqual({
      maxAge: 2
    });
  });

  test("should ignore invalid directives", () => {
    expect(
      parser(
        "max-age=NaN, s-maxage=NaN, stale-while-revalidate=NaN, stale-if-error=NaN"
      )
    ).toEqual({});
  });

  test("should not override previously declared directives if the directive is invalid", () => {
    expect(parser("max-age=1, max-age=NaN")).toEqual({
      maxAge: 1
    });
  });

  test("should ignore unknown directives", () => {
    expect(parser("unknown-directive")).toEqual({});
  });

  test("should ignore unknown directives", () => {
    expect(parser("unknown-directive=value")).toEqual({});
  });
};

describe("cache-control parser", () => {
  testSuite(cacheControlParser);
});

describe("compiled version", () => {
  testSuite(compiledCacheControlParser);
});
