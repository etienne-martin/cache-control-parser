import { CacheControl } from "./types";

type NumericDirective =
  | "max-age"
  | "min-fresh"
  | "s-maxage"
  | "stale-while-revalidate"
  | "stale-if-error";

type BooleanDirective =
  | "public"
  | "private"
  | "no-store"
  | "no-cache"
  | "must-revalidate"
  | "must-understand"
  | "only-if-cached"
  | "proxy-revalidate"
  | "immutable"
  | "no-transform";

const NUMERIC_DIRECTIVES: NumericDirective[] = [
  "max-age",
  "min-fresh",
  "s-maxage",
  "stale-while-revalidate",
  "stale-if-error",
];

const BOOLEAN_DIRECTIVES: BooleanDirective[] = [
  "public",
  "private",
  "no-store",
  "no-cache",
  "must-revalidate",
  "must-understand",
  "only-if-cached",
  "proxy-revalidate",
  "immutable",
  "no-transform",
];

const ARGUMENT_TOLERANT_BOOLEAN_DIRECTIVES: BooleanDirective[] = [
  "private",
  "no-cache",
  "immutable",
];

const OVERFLOW_DELTA_SECONDS = 2_147_483_648;

const isNumericDirective = (directive: string): directive is NumericDirective =>
  NUMERIC_DIRECTIVES.includes(directive as NumericDirective);

const isBooleanDirective = (directive: string): directive is BooleanDirective =>
  BOOLEAN_DIRECTIVES.includes(directive as BooleanDirective);

const splitDirectives = (cacheControlHeader: string): string[] => {
  const directives: string[] = [];
  let start = 0;
  let quoted = false;
  let escaped = false;

  for (let index = 0; index < cacheControlHeader.length; index += 1) {
    const character = cacheControlHeader[index];

    if (quoted && escaped) {
      escaped = false;
      continue;
    }

    if (quoted && character === "\\") {
      escaped = true;
      continue;
    }

    if (character === '"') {
      quoted = !quoted;
      continue;
    }

    if (!quoted && character === ",") {
      directives.push(cacheControlHeader.slice(start, index));
      start = index + 1;
    }
  }

  directives.push(cacheControlHeader.slice(start));
  return directives;
};

const parseDirective = (directive: string): [string, string | undefined] => {
  const separator = directive.indexOf("=");

  if (separator === -1) {
    return [directive.trim().toLowerCase(), undefined];
  }

  return [
    directive.slice(0, separator).trim().toLowerCase(),
    directive.slice(separator + 1).trim(),
  ];
};

const parseQuotedString = (value: string): string | undefined => {
  if (!value.startsWith('"') || !value.endsWith('"')) return undefined;

  let unescaped = "";

  for (let index = 1; index < value.length - 1; index += 1) {
    const character = value[index];

    if (character === "\\") {
      index += 1;

      if (index >= value.length - 1) return undefined;

      unescaped += value[index];
      continue;
    }

    if (character === '"') return undefined;

    unescaped += character;
  }

  return unescaped;
};

const parseDeltaSeconds = (value: string | undefined): number | undefined => {
  if (value === undefined) return undefined;

  const unquoted = parseQuotedString(value);
  let digits: string | undefined;

  if (/^\d+$/.test(value)) {
    digits = value;
  } else if (unquoted !== undefined && /^\d+$/.test(unquoted)) {
    digits = unquoted;
  }

  if (digits === undefined) return undefined;

  const seconds = Number(digits);
  return Number.isSafeInteger(seconds) ? seconds : OVERFLOW_DELTA_SECONDS;
};

const isDeltaSeconds = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 0;

export const parse = (cacheControlHeader: string): CacheControl => {
  const cacheControl: CacheControl = {};

  const directives = splitDirectives(cacheControlHeader).map(parseDirective);

  for (const [directive, value] of directives) {
    if (isNumericDirective(directive)) {
      const seconds = parseDeltaSeconds(value);

      if (seconds !== undefined) {
        cacheControl[directive] = seconds;
      }

      continue;
    }

    if (directive === "max-stale") {
      if (value === undefined) {
        cacheControl["max-stale"] = true;
        continue;
      }

      const seconds = parseDeltaSeconds(value);

      if (seconds !== undefined) {
        cacheControl["max-stale"] = seconds;
      }

      continue;
    }

    if (
      isBooleanDirective(directive) &&
      (value === undefined ||
        ARGUMENT_TOLERANT_BOOLEAN_DIRECTIVES.includes(directive))
    ) {
      cacheControl[directive] = true;
    }
  }

  return cacheControl;
};

export const stringify = (cacheControl: CacheControl) => {
  const directives: string[] = [];

  for (const [key, value] of Object.entries(cacheControl)) {
    if (isNumericDirective(key)) {
      if (isDeltaSeconds(value)) {
        directives.push(`${key}=${value}`);
      }

      continue;
    }

    if (key === "max-stale") {
      if (value === true) {
        directives.push(key);
      } else if (isDeltaSeconds(value)) {
        directives.push(`${key}=${value}`);
      }

      continue;
    }

    if (isBooleanDirective(key) && value === true) {
      directives.push(key);
    }
  }

  return directives.join(", ");
};
