# cache-control-parser

A humble [cache-control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) parser.

[![Build status](https://github.com/etienne-martin/cache-control-parser/workflows/Build/badge.svg)](https://github.com/etienne-martin/cache-control-parser/actions)
[![Coveralls github](https://img.shields.io/coveralls/github/etienne-martin/cache-control-parser.svg)](https://coveralls.io/github/etienne-martin/cache-control-parser)
[![npm monthly downloads](https://img.shields.io/npm/dm/cache-control-parser.svg)](https://www.npmjs.com/package/cache-control-parser)

## Features

- Fault-tolerant
- Case-insensitive
- No dependencies
- Built-in TypeScript support
- Thoroughly tested

✨ **New:** you can now stringify cache control objects

## Getting Started

### Installation

To use cache-control-parser in your project, run:

```bash
npm install cache-control-parser
```

### Usage

**Example** - parse a string of cache control directives into an object:

```javascript
import { parse } from "cache-control-parser";

const directives = parse(
  "public, max-age=300, no-transform"
);

console.log(directives);
```

Output:

```json
{
  "public": true,
  "max-age": 300,
  "no-transform": true
}
```

**Example** - destructuring the cache control object:

```javascript
import { parse } from "cache-control-parser";

const directives = parse(
  "max-age=300, s-maxage=0"
);

const { "max-age": maxAge, "s-maxage": sMaxAge } = directives;
```

**Example** - retrieve the shared proxy cache TTL:

```javascript
import { parse } from "cache-control-parser";

const { "max-age": maxAge, "s-maxage": ttl = maxAge } = parse(
  "max-age=300, s-maxage=0"
);

console.log("ttl:", ttl);
```

Output:

```
ttl: 0
```

**Example** - stringify a cache control object:

```javascript
import { stringify } from "cache-control-parser";

const cacheControl = stringify({
  "max-age": 300,
  "s-maxage": 3600,
  "public": true
});

console.log(cacheControl);
```

Output:

```
max-age=300, s-maxage=3600, public
```

**Example** - Next.js API route response header:

```typescript
import { stringify } from "cache-control-parser";
import type { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader(
    "Cache-Control",
    stringify({
      "max-age": 300,
    })
  );

  res.send("Hello world");
};
```

## Supported Directives

```
{
  "max-age"?: number;
  "s-maxage"?: number;
  "stale-while-revalidate"?: number;
  "stale-if-error"?: number;
  "public"?: boolean;
  "private"?: boolean;
  "no-store"?: boolean;
  "no-cache"?: boolean;
  "must-revalidate"?: boolean;
  "proxy-revalidate"?: boolean;
  "immutable"?: boolean;
  "no-transform"?: boolean;
}
```

## TypeScript

Type definitions are included in this library and exposed via:

```typescript
import type { CacheControl } from "cache-control-parser";
```

## Built with

- [node.js](https://nodejs.org/en/) - Cross-platform JavaScript run-time environment for executing JavaScript code server-side.
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript that compiles to plain JavaScript.
- [Jest](https://facebook.github.io/jest/) - Delightful JavaScript Testing.

## Contributing

When contributing to this project, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Update the [README.md](https://github.com/etienne-martin/cache-control-parser/blob/master/README.md) with details of changes to the library.

Execute `yarn test` and update the tests if needed.

### Testing

Run the full test suite:

```bash
yarn test
```

Run tests in watch mode:

```bash
yarn test:watch
```

## Authors

- **Etienne Martin** - _Initial work_ - [etiennemartin.ca](https://etiennemartin.ca/)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
