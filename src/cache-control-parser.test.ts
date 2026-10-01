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

    it("should parse all supported directives", () => {
      expect(
        parser(
          "max-age=1, max-stale=2, min-fresh=3, s-maxage=4, stale-while-revalidate=5, stale-if-error=6, public, private, no-store, no-cache, must-revalidate, must-understand, only-if-cached, proxy-revalidate, immutable, no-transform",
        ),
      ).toEqual({
        "max-age": 1,
        "max-stale": 2,
        "min-fresh": 3,
        "s-maxage": 4,
        "stale-while-revalidate": 5,
        "stale-if-error": 6,
        public: true,
        private: true,
        "no-store": true,
        "no-cache": true,
        "must-revalidate": true,
        "must-understand": true,
        "only-if-cached": true,
        "proxy-revalidate": true,
        immutable: true,
        "no-transform": true,
      });
    });

    it("should parse max-stale without a value", () => {
      expect(parser("max-stale")).toEqual({
        "max-stale": true,
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
      expect(
        parser(
          "Max-Age=1, S-MAXAGE=2, Stale-While-Revalidate=3, MUST-UNDERSTAND",
        ),
      ).toEqual({
        "max-age": 1,
        "s-maxage": 2,
        "stale-while-revalidate": 3,
        "must-understand": true,
      });
    });

    it("should support directives that are not separated by spaces", () => {
      expect(parser("max-age=60,public")).toEqual({
        "max-age": 60,
        public: true,
      });
    });

    it("should override previously declared directives", () => {
      expect(parser("max-age=1, max-age=2, max-stale, max-stale=3")).toEqual({
        "max-age": 2,
        "max-stale": 3,
      });
    });

    it("should ignore invalid directives", () => {
      expect(
        parser(
          "max-age=NaN, max-stale=NaN, min-fresh=NaN, s-maxage=NaN, stale-while-revalidate=NaN, stale-if-error=NaN",
        ),
      ).toEqual({});
    });

    it.each([
      "max-age",
      "max-age=",
      "max-age=-1",
      "max-age=+1",
      "max-age=1.5",
      "max-age=1second",
      "max-age=1=2",
      'max-age=" 1 "',
      'max-age="60',
      'max-age="60\\"',
      'max-age="6"0"',
      "max-age='1'",
    ])("should reject malformed delta-seconds in %s", (header) => {
      expect(parser(header)).toEqual({});
    });

    it("should accept quoted delta-seconds", () => {
      expect(parser('max-age="60", max-stale="120", min-fresh="0"')).toEqual({
        "max-age": 60,
        "max-stale": 120,
        "min-fresh": 0,
      });
    });

    it("should decode quoted-pairs in quoted delta-seconds", () => {
      expect(parser('max-age="6\\0"')).toEqual({
        "max-age": 60,
      });
    });

    it("should preserve representable values and handle numeric overflow", () => {
      expect(
        parser(
          `max-age=${Number.MAX_SAFE_INTEGER}, min-fresh=9007199254740992`,
        ),
      ).toEqual({
        "max-age": Number.MAX_SAFE_INTEGER,
        "min-fresh": 2_147_483_648,
      });
    });

    it("should not override previously declared directives if the directive is invalid", () => {
      expect(parser("max-age=1, max-age=NaN, max-stale=2, max-stale=")).toEqual(
        {
          "max-age": 1,
          "max-stale": 2,
        },
      );
    });

    it("should not parse commas inside quoted extension values", () => {
      expect(parser('extension="a, max-age=999", public')).toEqual({
        public: true,
      });
    });

    it("should respect escaped quotes inside quoted extension values", () => {
      expect(parser('extension="a\\\", max-age=999", public')).toEqual({
        public: true,
      });
    });

    it("should keep the rest of an unterminated quoted value together", () => {
      expect(parser('extension="a, max-age=999')).toEqual({});
    });

    it("should tolerate qualified boolean directives", () => {
      expect(
        parser(
          'private="authorization, cookie", no-cache="set-cookie", immutable=ignored, max-age=60',
        ),
      ).toEqual({
        private: true,
        "no-cache": true,
        immutable: true,
        "max-age": 60,
      });
    });

    it("should ignore arguments on argumentless boolean directives", () => {
      expect(parser("public=0, must-understand=x, only-if-cached=x")).toEqual(
        {},
      );
    });

    it("should ignore unknown directives", () => {
      expect(parser("unknown-directive")).toEqual({});
    });

    it("should ignore unknown directives with values", () => {
      expect(parser("unknown-directive=value")).toEqual({});
    });
  });

  describe("stringify", () => {
    it("should stringify empty cache control", () => {
      expect(stringifier({})).toEqual("");
    });

    it("should stringify all supported directives", () => {
      expect(
        stringifier({
          "max-age": 1,
          "max-stale": 2,
          "min-fresh": 3,
          "s-maxage": 4,
          "stale-while-revalidate": 5,
          "stale-if-error": 6,
          public: true,
          private: true,
          "no-store": true,
          "no-cache": true,
          "must-revalidate": true,
          "must-understand": true,
          "only-if-cached": true,
          "proxy-revalidate": true,
          immutable: true,
          "no-transform": true,
        }),
      ).toEqual(
        "max-age=1, max-stale=2, min-fresh=3, s-maxage=4, stale-while-revalidate=5, stale-if-error=6, public, private, no-store, no-cache, must-revalidate, must-understand, only-if-cached, proxy-revalidate, immutable, no-transform",
      );
    });

    it("should stringify max-stale without a value", () => {
      expect(stringifier({ "max-stale": true })).toEqual("max-stale");
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
          "max-stale": false,
          public: false,
          private: false,
          immutable: false,
        } as CacheControl),
      ).toEqual("max-age=1");
    });

    it("should omit invalid values without throwing", () => {
      expect(
        stringifier({
          "max-age": -1,
          "max-stale": -1,
          "min-fresh": 1.5,
          "s-maxage": Number.NaN,
          "stale-while-revalidate": Number.POSITIVE_INFINITY,
          "stale-if-error": Number.MAX_SAFE_INTEGER + 1,
          public: "true",
          private: 1,
        } as unknown as CacheControl),
      ).toEqual("");
    });
  });
});
