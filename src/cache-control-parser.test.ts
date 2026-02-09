import { CacheControl, parse, stringify } from "./";
import {
  parse as compiledParser,
  stringify as compiledStringifier,
} from "../dist";

describe.each<[string, typeof parse, typeof stringify]>([
  ["source", parse, stringify],
  ["compiled", compiledParser, compiledStringifier],
])("%s", (_name, parser, stringifier) => {
  describe("parse", () => {
    it("should parse empty cache-control header", () => {
      expect(parser("")).toEqual({});
    });

    it("should parse both boolean and numeric directives", () => {
      expect(
        parser(
          "max-age=1, s-maxage=2, stale-while-revalidate=3, stale-if-error=4, public, private, no-store, no-cache, must-revalidate, proxy-revalidate, immutable, no-transform",
        ),
      ).toEqual({
        "max-age": 1,
        "s-maxage": 2,
        "stale-while-revalidate": 3,
        "stale-if-error": 4,
        public: true,
        private: true,
        "no-store": true,
        "no-cache": true,
        "must-revalidate": true,
        "proxy-revalidate": true,
        immutable: true,
        "no-transform": true,
      });
    });

    it("should trim directives", () => {
      expect(
        parser("   max-age =  60 ,    s-maxage  = 3600 , public   "),
      ).toEqual({
        "max-age": 60,
        "s-maxage": 3600,
        public: true,
      });
    });

    it("should be case-insensitive", () => {
      expect(parser("Max-Age=1, S-MAXAGE=2, Stale-While-Revalidate=3")).toEqual(
        {
          "max-age": 1,
          "s-maxage": 2,
          "stale-while-revalidate": 3,
        },
      );
    });

    it("should support directives that are not separated by spaces", () => {
      expect(parser("max-age=60,public")).toEqual({
        "max-age": 60,
        public: true,
      });
    });

    it("should override previously declared directives", () => {
      expect(parser("max-age=1, max-age=2")).toEqual({
        "max-age": 2,
      });
    });

    it("should ignore invalid directives", () => {
      expect(
        parser(
          "max-age=NaN, s-maxage=NaN, stale-while-revalidate=NaN, stale-if-error=NaN",
        ),
      ).toEqual({});
    });

    it("should not override previously declared directives if the directive is invalid", () => {
      expect(parser("max-age=1, max-age=NaN")).toEqual({
        "max-age": 1,
      });
    });

    it("should ignore unknown directives", () => {
      expect(parser("unknown-directive")).toEqual({});
    });

    it("should ignore unknown directives", () => {
      expect(parser("unknown-directive=value")).toEqual({});
    });
  });

  describe("stringify", () => {
    it("should stringify empty cache control", () => {
      expect(stringifier({})).toEqual("");
    });

    it("should stringify both boolean and numeric directives", () => {
      expect(
        stringifier({
          "max-age": 1,
          "s-maxage": 2,
          "stale-while-revalidate": 3,
          "stale-if-error": 4,
          public: true,
          private: true,
          "no-store": true,
          "no-cache": true,
          "must-revalidate": true,
          "proxy-revalidate": true,
          immutable: true,
          "no-transform": true,
        }),
      ).toEqual(
        "max-age=1, s-maxage=2, stale-while-revalidate=3, stale-if-error=4, public, private, no-store, no-cache, must-revalidate, proxy-revalidate, immutable, no-transform",
      );
    });

    it("should leave out unsupported directives", () => {
      expect(
        stringifier({
          "max-age": 1,
          foo: 2,
          bar: true,
        } as CacheControl),
      ).toEqual("max-age=1");
    });

    it("should not include falsy booleans", () => {
      expect(
        stringifier({
          "max-age": 1,
          public: false,
          private: false,
          immutable: false,
        } as CacheControl),
      ).toEqual("max-age=1");
    });
  });
});
